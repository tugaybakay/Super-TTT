import socket from "../socket";
import CreateUserModal from "./modals/CreateUserModal";
import CreateOrJoinRoomModal from "./modals/CreateOrJoinRoomModal";
import InviteFriendModal from "./modals/InviteFriendModal";
import React from "react";
import Game from "./Interfaces/GameInterface";
import Confetti from 'react-confetti'
import GameOverModal from "./modals/GameOverModal";

function CustomModals() {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  const [username,setUsername] = React.useState<boolean>(false);
  const [isJoinedRoom,setIsJoinedRoom] = React.useState<boolean>(false);
  const [winner,setWinner] = React.useState<null | string>(null);

  
  
  React.useEffect(() => {
    if(modalRef.current) modalRef.current.showModal();
  },[])

  React.useEffect(() => {

    socket.on("game-ready",() => {
      modalRef.current?.close();
    })

    socket.on("sync",(game: Game) => {
      if(game.winner === null) return;
      if(game.winner === "D") setWinner("Draw!");
      else setWinner(`${game.winner} won!`);
      modalRef.current?.showModal();
    })

    socket.on("error",(msg: string) => {
      window.alert(msg);
    });

    socket.on("user-created",(username: string) => {
      socket.username = username;
      setUsername(true);
    });

    socket.on("room-created",(roomid: string) => {
      socket.roomID = roomid;
      setIsJoinedRoom(true);
    });

    socket.on("game-restarted", () => {
      modalRef.current?.close();
    });

  },[socket])

  function createUser(username: string | null) {
    socket.emit("create-user",username);
    
  }

  function handleEscapeEvent(event: KeyboardEvent) {
    if(event.key === "Escape") event.preventDefault();
  }

  function createRoom(selectedSymbol: string) {
    socket.emit("create-room",selectedSymbol);
  }

  function joinRoom(roomID: string) {
    socket.emit("join-room",roomID);
  }

  return(
    <dialog 
      onKeyDown={(event: KeyboardEvent) => handleEscapeEvent(event)}  
      ref={modalRef}
      className="rounded-md backdrop:bg-black backdrop:opacity-55 m-auto p-8 border border-black outline-none  max-w-max max-sm:p-4">
      {!winner && !username && 
        <CreateUserModal 
          createUser={createUser}
      />}
      {!winner && username && !isJoinedRoom && <CreateOrJoinRoomModal
        createRoom={createRoom}
        joinRoom={joinRoom}
      />}
      {!winner &&isJoinedRoom && <InviteFriendModal roomID={socket.roomID}/>}
      {winner && <GameOverModal text={winner}/>}
    </dialog>
  )
}

export default CustomModals;