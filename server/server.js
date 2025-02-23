import { Server } from "socket.io";
import { checkDiagonal, checkHorizontal, checkVertical, checkDraw, isOver } from "./modules/checkFuncs.js";

const io = new Server(
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

let players = {};
let games = {};

io.on("connection", (socket) => {

  socket.on("create-user",(username) => {
    const usernameList = Object.values(players).map(player => player.username);
    if (usernameList.includes(username)) {
      socket.emit("error","Username is already exists!");
    }
    else {
      socket.emit("user-created",username);
      players[socket.id] = {username,roomID: null, symbol: null,id: socket.id};
    }
  })
  
  socket.on("create-room",(selectedSymbolFromUser) => {
    const player = players[socket.id];
    player.roomID = socket.id.slice(0,5);
    socket.roomID = player.roomID;
    socket.join(player.roomID);
    player.symbol = selectSymbol(selectedSymbolFromUser);
    switch (player.symbol) {
      case "X":
        createGame(player.roomID,player,"X");
        break;
      case "O":
        createGame(player.roomID,player,"O");
        break;
    }
    socket.emit("room-created",player.roomID);
  })

  socket.on("join-room",async (roomid) => {
    const joinedSockets = await io.in(roomid).fetchSockets();
    const joinedSocketsCount = joinedSockets.length;
    if(joinedSocketsCount === 0) {
      socket.emit("error","Room was not found!");
    }else if(joinedSocketsCount === 2) {
      socket.emit("error","The room is full!");
    }else {
      socket.join(roomid);
      socket.roomID = roomid;
      const game = games[roomid];
      if(game.playerX === null) {
        game.playerX = players[socket.id];
        players[socket.id].symbol = "X";
        players[socket.id].roomID = roomid;
      }
      else{
        game.playerO = players[socket.id];
        players[socket.id].symbol = "O";
        players[socket.id].roomID = roomid;
      } 
      io.to(socket.roomID).emit("game-ready");
      io.to(socket.roomID).emit("start",games[roomid]);
    }
  });

  socket.on("play",cliNesne => {
    let game = games[socket.roomID];
    game.lastPlayIndex = cliNesne.index;
    game.gameBoard[cliNesne.boardIndex][cliNesne.index] = cliNesne.symbol;
    game.turn = cliNesne.symbol === "X" ? "O" : "X";
    for(let i = 0; i < 9; i++) {
      const result = game.results[i];
      if(result != null){
        continue;
      } 
      game.results[i] = checkHorizontal(game.gameBoard[i],game.results[i]);
      game.results[i] = checkVertical(game.gameBoard[i],game.results[i]);
      game.results[i] = checkDiagonal(game.gameBoard[i],game.results[i]);
      game.results[i] = checkDraw(game.gameBoard[i],game.results[i]);
    }
    switch(isOver(game.results)){
      case null:
        break;
      case "X":
        game.winner = game.playerX.username;
        break;
      case "O":
        game.winner = game.playerO.username;
        break;
      case "D":
        game.winner = "D";
        break;
    }
    io.to(socket.roomID).emit("sync",game);
  }) 
  
  socket.on("reset",() => {
    if(games[socket.roomID] === undefined) return;
    games[socket.roomID].resetCount += 1;
    io.to(socket.roomID).emit("reset",(games[socket.roomID].resetCount));
    if(games[socket.roomID].resetCount === 2) {
      resetGame(games[socket.roomID]);
      io.to(socket.roomID).emit("game-restarted");
      io.to(socket.roomID).emit("sync",games[socket.roomID]);
    }
  });

  socket.on("disconnect", (_) => {
    if(games[socket.roomID] === undefined) return;
    const game = games[socket.roomID]
    if(game.playerX.id === socket.id) game.winner = game.playerO.username;
    else game.winner = game.playerX.username
    io.to(socket.roomID).emit("sync",game);
    io.to(socket.roomID).emit("error","Enemy left the game!");
    delete games[socket.roomID];
    delete players[socket.id];
  });

});

function selectSymbol(selectedSymbolFromUser) {
  if(selectedSymbolFromUser === "?") {
    let randomSymbol;
    Math.random() < 0.5 ?  randomSymbol = "X" : randomSymbol = "O";
    return randomSymbol;
  }
  return selectedSymbolFromUser;
}

function createGame(roomid,player,symbol) {
  games[roomid] = {
    playerX: symbol==="X" ? player : null,
    playerO: symbol==="O" ? player : null,
    roomID: roomid,
    turn: "X",
    gameBoard: createEmptyGameBoard(),
    results: [null,null,null,null,null,null,null,null,null] ,
    winner: null,
    lastPlayIndex: null,
    resetCount: 0
  }
}

function createEmptyGameBoard() {
  const emptyBoard= [];
  for(let i=0;i<9;i++) {
    emptyBoard.push([null,null,null,null,null,null,null,null,null]);
  }
  return emptyBoard;
}

function resetGame(game) {
  game.results = [null,null,null,null,null,null,null,null,null];
  game.gameBoard = createEmptyGameBoard();
  game.lastPlayIndex = null;
  game.winner = null;
  game.resetCount = 0;
  game.turn = "X";
}

io.listen(3000);

