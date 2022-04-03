import { Component } from '@angular/core';
import {UserService} from './services/user.service';
import {Game} from './models/game';
import {GameService} from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TicTacToe';

  username: string = '';
  game: Game|null = null;

  constructor() {
    UserService.Changes.subscribe(user => {
      if (user && user.username) {
        this.username = user.username;
      }
    });
    this.username = UserService.UserName;

    GameService.Changes.subscribe(game => {
      if (game && game.gameid) {
        this.game = game;
      } else if (!game) {
        this.game = null;
      }
    });
    if (GameService.Game) {
      this.game = GameService.Game;
    }
  }
}
