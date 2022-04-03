import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {GameService} from '../../services/game.service';
import {Game} from '../../models/game';
import {UuidService} from '../../services/uuid.service';

@Component({
  selector: 'app-wait-for-revanche',
  templateUrl: './wait-for-revanche.component.html',
  styleUrls: ['./wait-for-revanche.component.scss']
})
export class WaitForRevancheComponent implements OnInit {
  game: Game|null = null;
  get requester(): boolean {
    return UserService.UserId === this.game?.revanche;
  };

  constructor() { }

  ngOnInit(): void {
    GameService.Changes.subscribe(game => {
      if (game && game.gameid) {
        this.game = game;
        if (game.revanche !== game.user_1.userid && game.revanche !== game.user_2.userid) {
          GameService.LoadGame(game.revanche);
        }
      }
    });
    if (GameService.Game) {
      this.game = GameService.Game;
    }
    GameService.WaitOnOpponentPlaying();
  }

  accept() {
    this.game.revanche = UuidService.Create();
    GameService.UpdateGame(this.game);
    GameService.CreateRevengeGame(this.game.revanche);
  }

  reject() {
    this.game.revanche = null;
    GameService.UpdateGame(this.game).then(() => {
      GameService.UnsetGame();
    });
  }
}
