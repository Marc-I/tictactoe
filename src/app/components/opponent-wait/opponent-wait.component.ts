import { Component, OnInit } from '@angular/core';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-opponent-wait',
  templateUrl: './opponent-wait.component.html',
  styleUrls: ['./opponent-wait.component.scss']
})
export class OpponentWaitComponent implements OnInit {
  gameid: string = '';
  joingameid: string = '';

  constructor() { }

  ngOnInit(): void {
    GameService.Changes.subscribe(game => {
      if (game && game.gameid) {
        this.gameid = game.gameid.substr(-6);
      }
    });
    this.gameid = GameService.Game?.gameid.substr(-6) || '';

    GameService.WaitOnOpponent();
  }

  joinGame() {
    GameService.JoinGame(this.joingameid);
  }

}
