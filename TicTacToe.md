
USER
{
  userid: guid,
  username: string
}

GAME
{
  gameid: guid,
  user_1: guid,
  user_2: guid
}

BOARD
{
  gameid: guid,
  board: string (----x-o--)
}
