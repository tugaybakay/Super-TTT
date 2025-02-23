function InviteFriendModal({ roomID }: { roomID?: string | null }) {

  function handleClick(event: React.MouseEvent<HTMLInputElement>) {
    const joinRoomid = event.target.value;
    if(joinRoomid === "Copied!") return;
    navigator.clipboard.writeText(joinRoomid);
    event.target.value = "Copied!";
    setTimeout(() => {
      event.target.value = joinRoomid;
    },750);
  }

  return(
  <>
    <h2 className="text-2xl text-center font-bold mb-1.5 max-sm:text-xl">Invite a friend with ID!</h2>
    <input className="dialog-input cursor-pointer text-center font-semibold text-2xl w-full" readOnly value={roomID!}
    onClick={(event) => handleClick(event)}/>
    <p className="text-center my-3 text-lg">or</p>
    <h2 className="font-bold text-2xl text-center mb-1.5 max-sm:text-xl">Invite with a link!</h2>
    <input className="dialog-input cursor-pointer text-center font-semibold text-2xl w-full" readOnly value={`localhost:5173/?roomid=${roomID}`} onClick={(event) => handleClick(event)}/>
  </>)
}

export default InviteFriendModal;