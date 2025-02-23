import { useEffect } from "react";

interface CreateRoomProps {
  createRoom: (selectedSymbol: string) => void
  joinRoom: (roomID: string) => void
}

function CreateOrJoinRoomModal({createRoom,joinRoom} :CreateRoomProps) {
  

  useEffect(() => {
    
    const urlSearchParams = new URLSearchParams(window.location.search);
    const roomid = urlSearchParams.get("roomid")
    if(roomid) {
      joinRoom(roomid);
    }
  },[]);

  return(
  <div>
    <h2 
      className="font-bold text-xl mb-3 text-center max-sm:text-lg">
      Join to your friend!
    </h2>
    <form 
      action={(formData: FormData) => joinRoom(formData.get("roomID") as string)} 
      className="flex justify-center">
      <input 
        className="dialog-input" 
        required
        placeholder="RoomID"
        name="roomID"/>
      <button 
        className="dialog-button">
        Join
        </button>
    </form>
    <p className="text-center font-light mt-5 mb-1">
      or
      </p>
    <h2
      className="font-bold text-xl text-center max-sm:text-lg">
        Create a room!
      </h2>
    <div className="flex justify-between mt-3 items-center">
      <button 
        onClick={() => createRoom("X")}
        className="create-room-button dialog-button">
        X
        </button>
      <button 
        onClick={() => createRoom("?")}
        className="create-room-button dialog-button">
        ?
        </button>
      <button 
        onClick={() => createRoom("O")}
        className="create-room-button dialog-button">
        O
        </button>
    </div>
  </div>)
}

export default CreateOrJoinRoomModal;