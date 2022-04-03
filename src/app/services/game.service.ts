import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UuidService} from './uuid.service';
import {ApiService} from './api.service';
import {enGameStatus, Game} from '../models/game';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private static storageloaded = false;
  private static game: Game|null;
  public static Changes = new Subject<Game>();

  public static get Game(): Game|null {
    if (!this.storageloaded) {
      this.loadStorage();
    }
    return this.game;
  }

  constructor() { }

  private static loadStorage(): void {
    let gameid = localStorage.getItem('ttt_gameid');
    if (gameid) {
      ApiService.GET<Game>('/game/' + gameid).then(e => {
        if (e && e.gameid) {
          this.game = e;
          this.Changes.next(e);
        }
      });
    } else {
      this.storageloaded = true;
    }
  }

  static LoadGame(GameId: string): void {
    if (GameId) {
      ApiService.GET<Game>('/game/' + GameId).then(e => {
        if (e && e.gameid) {
          this.game = e;
          localStorage.setItem('ttt_gameid', this.game.gameid);
          this.Changes.next(e);
        }
      });
    }
  }

  static CreateNewGame(): Promise<Game> {
    const game = new Game();
    game.gameid = UuidService.Create();
    game.user_1 = UserService.User;
    game.turn = UserService.User;
    game.start_user = UserService.User;

    return this.createGame(game);
  }

  static CreateRevengeGame(NewGameId: string): Promise<Game> {
    if (!this.game) {
      return new Promise<Game>((a, b) => b());
    }
    const game = new Game();
    game.gameid = NewGameId;
    game.user_1 = this.game.user_1;
    game.user_2 = this.game.user_2;
    game.start_user = this.game.start_user?.userid === this.game.user_1?.userid ? this.game.user_2 : this.game.user_1;
    game.turn = this.game.start_user;

    return this.createGame(game);
  }

  private static createGame(game: Game) {
    return ApiService.POST<Game>('/game', game).then(e => {
      if (e.gameid && e.gameid === game.gameid) {
        this.game = e;
        localStorage.setItem('ttt_gameid', this.game.gameid);
        this.Changes.next(e);
      }
      return e;
    });
  }

  private static _waitOnOpponent: number;
  static WaitOnOpponent(): void {
    clearInterval(this._waitOnOpponent);
    this._waitOnOpponent = setInterval(() => {
      ApiService.GET<Game>('/game/' + this.game?.gameid).then(e => {
        if (e && !!e.user_2) {
          this.game = e;
          this.Changes.next(e);
          clearInterval(this._waitOnOpponent);
        }
      });
    }, 1000);
  }

  static JoinGame(GameId: string): Promise<Game> {
    return ApiService.GET<Game>(`/gamesearch/${GameId}`).then(e => {
      if (e && e.gameid) {
        this.game = e;
        this.game.user_2 = UserService.User;
        return this.UpdateGame(this.game);
      }
      return e;
    });
  }

  static UpdateGame(game: Game): Promise<Game> {
    return ApiService.PUT<Game>('/game', game).then(e => {
      if (e.gameid && e.gameid === game.gameid) {
        this.game = e;
        localStorage.setItem('ttt_gameid', game.gameid);
        this.Changes.next(e);
      }
      return e;
    });
  }

  private static _waitOnOpponentPlaying: number;
  static WaitOnOpponentPlaying(): void {
    clearInterval(this._waitOnOpponentPlaying);
    this._waitOnOpponentPlaying = setInterval(() => {
      ApiService.GET<Game>('/game/' + this.game?.gameid).then(e => {
        if (e
          && (e.turn?.userid === UserService.UserId || e.status !== enGameStatus.RUNNING)
          && (!e.revanche)) {
          this.game = e;
          this.Changes.next(e);
          // clearInterval(this._waitOnOpponentPlaying);
        } if (e && e.revanche !== this.game.revanche) {
          this.game = e;
          this.Changes.next(e);
        }
      });
    }, 1000);
  }

  static UnsetGame() {
    this.game = null;
    localStorage.removeItem('ttt_gameid');
    clearInterval(this._waitOnOpponent);
    clearInterval(this._waitOnOpponentPlaying);
    this.Changes.next();
  }
}
