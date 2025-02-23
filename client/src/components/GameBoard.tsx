import { JSX, useEffect, useState } from "react";

function GameBoard({isMyTurn,boardIndex,onClick,gameBoard,canPlayable}:{isMyTurn:boolean,boardIndex: number,gameBoard:(string | null)[],onClick: (boardIndex:number,index:number) => void,canPlayable: boolean}) {
  const [result,setResult] = useState<string | null>(null);
  
  useEffect(() => {
    checkHorizontal(gameBoard);
    checkVertical(gameBoard);
    checkDiagonal(gameBoard);
    checkDraw(gameBoard);
  },[gameBoard])
  
  const buttonElements: JSX.Element[] = [];
  for(let i = 0; i < 9 ; i++) {
    buttonElements.push(<button disabled={gameBoard[i] != null ? true : false} className={`${(isMyTurn && canPlayable) ? "game-button" : "disabled-game-button"} bg-gray-200 rounded-sm flex justify-center items-center`} key={i}
    onClick={() => onClick(boardIndex,i)}>{gameBoard[i]}</button>)
  }

  function checkHorizontal(board: (string | null)[]) {
    for(let i = 0; i < 3; i++) {
      if(board[i *3] === board[i*3 +1] && board[i*3] === board[i*3 + 2] && board[i*3] != null)
        setResult(board[i*3]);
    }
  }
 
  function checkVertical(board: (string | null)[]) {
    for(let i = 0; i < 3; i++) {
      if(board[i] === board[i + 3] && board[i + 6] === board[i + 3] && board[i] != null)
        setResult(board[i]);
    }
    
  }
  
  function checkDiagonal(board: (string | null)[]) {
    for(let i = 0; i < 3; i++) {
      if ((board[0] === board[4] && board[4] === board[8]) || (board[2] === board[4] && board[4] === board[6]) && board[4] != null) setResult(board[4]);
    }
  } 
  
  function checkDraw(board: (string | null)[]) {
    if(board.every(value => value !== null)) setResult("D");
  }

  const blockElem: JSX.Element = <div className="absolute w-full h-full bg-amber-400 flex justify-center items-center text-7xl max-sm:text-6xl z-10">{result}</div>;

  return(
    <div className="relative grid grid-cols-3 grid-rows-3 gap-0.5 bg-black p-0.5">
      {result && blockElem}
      {!result && buttonElements}
    </div>
  )
}



export default GameBoard;