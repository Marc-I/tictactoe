import {User} from './user';

export enum enGameStatus {
  RUNNING,
  DRAW,
  WON
}

export class Game {
  gameid: string = '';
  user_1?: User;
  user_2?: User;
  turn?: User;
  start_user?: User;
  status = enGameStatus.RUNNING;
  board: string = '---------';
  revanche?: string;
}
