import Player from "./PlayerInterface";

export default interface Game {
  playerX: Player;
  playerO: Player;
  gameBoard: (string | null)[][];
  results: string[];
  lastPlayIndex: number | null;
  turn: string;
  winner: string | null;
}