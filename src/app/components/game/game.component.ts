import {Component, OnInit} from '@angular/core';
import {GameService} from '../../services/game.service';
import {enGameStatus, Game} from '../../models/game';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  numbers = [0,1,2,3,4,5,6,7,8];
  game: Game|null = null;
  winCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  enGameStatus = enGameStatus;

  constructor() { }

  ngOnInit(): void {
    GameService.Changes.subscribe(game => {
      if (game && game.gameid) {
        this.game = game;
        // if (game.status !== enGameStatus.RUNNING) {
        //   RevancheService.CheckForRevange(UserService.UserId);
        // }
      }
    });
    this.game = GameService.Game;
    GameService.WaitOnOpponentPlaying();
  }

  play(field: number) {
    if (!this.game) {
      return;
    }
   if (this.game.turn?.userid === UserService.UserId) {
     this.game.board = `${this.game.board.substr(0, field)}${this.game.turn.userid === this.game.user_1?.userid ? 'x' : 'o'}${this.game.board.substr( field + 1)}`;

     if (this.checkWin(this.game)) {
       this.game.status = enGameStatus.WON;
     } else if (this.checkDraw(this.game)) {
       this.game.status = enGameStatus.DRAW;
     } else {
       this.game.turn = this.game.turn?.userid === this.game.user_1?.userid ? this.game.user_2 : this.game.user_1;
     }

     GameService.UpdateGame(this.game).then(() => {
       if (this.game?.status === enGameStatus.RUNNING) {
         GameService.WaitOnOpponentPlaying();
       }
     });
   }
  }

  checkWin(game: Game) {
    let win = false;
    this.winCombinations.forEach(seq => {
      if (game.board[seq[0]] !== '-' && game.board[seq[0]] === game.board[seq[1]] && game.board[seq[1]] === game.board[seq[2]]) {
        win = true;
      }
    });
    return win;
  }

  checkDraw(game: Game) {
    return game.board.indexOf('-') === -1;
  }

  revanche() {
    if (!this.game) {
      return;
    }
    this.game.revanche = UserService.UserId;
    GameService.UpdateGame(this.game);
  }

  newGame() {
    GameService.CreateNewGame();
  }
}
