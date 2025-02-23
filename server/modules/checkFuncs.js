export function checkHorizontal(board,result) {
  if(result != null) return result;
  for(let i = 0; i < 3; i++) {
    if(board[i *3] === board[i*3 +1] && board[i*3] === board[i*3 + 2] && board[i*3] != null){
      return board[i*3];
    }
  }
  return null
}

export function checkVertical(board,result) {
  if(result != null) return result;
  for(let i = 0; i < 3; i++) {
    if(board[i] === board[i + 3] && board[i + 6] === board[i + 3] && board[i] != null)
      return board[i];
  }
  return null;
}

export function checkDiagonal(board,result) {
  if(result != null) return result;
  for(let i = 0; i < 3; i++) {
    if ((board[0] === board[4] && board[4] === board[8]) || (board[2] === board[4] && board[4] === board[6]) && board[4] != null) return board[4];
  }
  return null;
}

export function checkDraw(board,result) {
  if(result != null) return result;
  if(board.every(value => value !== null)) return "D";
  return null;
}

export function isOver(resultsBoard) {
  let result = null;
  result = checkHorizontal(resultsBoard,result);
  result = checkDiagonal(resultsBoard,result);
  result = checkVertical(resultsBoard,result);
  result = checkDraw(resultsBoard,result);
  return result
}