import { Component, OnInit } from '@angular/core';
import {GameService} from '../../services/game.service';

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.component.html',
  styleUrls: ['./game-selection.component.scss']
})
export class GameSelectionComponent implements OnInit {
  gameid = '';

  constructor() { }

  ngOnInit(): void {
  }

  createGame() {
    GameService.CreateNewGame();
  }

  joinGame() {
    GameService.JoinGame(this.gameid);
  }

}
