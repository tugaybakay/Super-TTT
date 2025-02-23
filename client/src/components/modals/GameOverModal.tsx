import socket from "../../socket";
import { useState, useEffect } from "react";

function GameOverModal({text}: {text: string}) {
  const [resetCount,setResetCount] = useState<number>(0);
  const [didTapReset,setDidTapReset] = useState<boolean>(false);

  useEffect(() => {
    socket.on("reset",(resCount) => {
      setResetCount(resCount); 
    })

    socket.on("game-restarted",() => {
      setResetCount(0);
      setDidTapReset(false);
    })
  },[socket])

  function resetDidTap() {
    if(didTapReset) return;
    setDidTapReset(true);
    socket.emit("reset");
  }

  return(
  <div className="px-10 py-4 flex flex-col justify-between items-center max-sm:px-8">
    <h2 className="font-semibold text-5xl text-center mb-10 max-sm:text-3xl max-sm:mb-5">{text}</h2>
    <button onClick={resetDidTap} className="dialog-button ">reset {resetCount}/2</button>
  </div>)
}

export default GameOverModal;