import { JSX } from "react";
import React from "react";
import GameBoard from "./GameBoard";
import socket from "../socket";
import Game from "./Interfaces/GameInterface";
import Player from "./Interfaces/PlayerInterface";

function MainGameContainer() {
  const [game,setGame] = React.useState<Game | null>(null);
  //const [symbol,setSymbol] = React.useState<string | null>(null);
  const symbolRef = React.useRef<string | null>(null);
  const [player,setPlayer] = React.useState<Player | null>(null);
  const [enemyPlayer,setEnemyPlayer] = React.useState<Player | null>(null);
  const [isMyTurn, setIsMyTurn] = React.useState<boolean>(false);


  React.useEffect(() => {

    socket.on("start",(game: Game) => {
      setGame(game);
      if(game.playerX.username === socket.username) {
        //setSymbol("X");
        symbolRef.current = "X";
        setPlayer(game.playerX);
        setEnemyPlayer(game.playerO);
        setIsMyTurn(true);
      }else {
        //setSymbol("O");
        symbolRef.current = "O";
        setPlayer(game.playerO);
        setEnemyPlayer(game.playerX);
      }

    })

    socket.on("sync",(game: Game) => {
      setGame(game);
      if(game.turn === symbolRef.current)setIsMyTurn(true);
      else setIsMyTurn(false);
    });

  },[socket]);

  function gameButtonDidTap(boardIndex: number,index: number) {
    if(!isMyTurn) return;
    socket.emit("play",{boardIndex,index,symbol: symbolRef.current});
  }

  
  let gameBoardElements: JSX.Element[] = [];

  for(let i = 0; i < 9; i++) {

    let canPlayable: boolean = false;
    if(game === null || game.lastPlayIndex === null) {
      canPlayable = true;
      //console.log("TEST");
    }
    else if(game.results[game.lastPlayIndex] === null && game.lastPlayIndex === i) canPlayable = true;
    else if(game.results[game.lastPlayIndex] != null) canPlayable = true;


    gameBoardElements.push(<GameBoard 
      key={i}
      isMyTurn={isMyTurn}
      canPlayable={canPlayable}
      boardIndex={i}
      gameBoard={game ? game.gameBoard[i] : [null,null,null,null,null,null,null,null,null]}
      onClick={gameButtonDidTap}
      />)
  }

  return (
    <div className="h-10/12 flex flex-col justify-center items-center -mt-10">
      {game && <h2 className="text-3xl text-center font-semibold my-7">{isMyTurn ? `(${symbolRef.current})'s turn: ${player?.username}` : `(${enemyPlayer?.symbol})'s turn: ${enemyPlayer?.username}`}</h2>}
      <main className="w-5/12 h-8/12 bg-black grid grid-cols-3 grid-rows-3 gap-0.5 p-1 rounded-sm 
        max-sm:w-10/12 max-sm:h-7/12">
        {gameBoardElements}
      </main>
  </div>
  )
}

export default MainGameContainer;

//