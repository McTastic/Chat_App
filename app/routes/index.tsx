import { useState } from "react";
import { useSocket } from "~/context";
import Chat from "../components/chat";

export default function Index() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const socket = useSocket();

  const joinRoom = () => {
    event?.preventDefault;
    if (!socket) return;
    if (username !== "" && room !== "") {
      socket.emit("join_room", username, room);
      setShowChat(true);
    } else {
      window.alert("You need to enter a Room ID and a Username to continue.");
    }
  };

  return (
    <div className="main" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: "1.4",
        }}
      >
        <h1 className={!showChat ? "neon" : "non-neon"}>
          <span className="neon1">C</span>
          <span className="neon2">H</span>
          <span className="neon3">A</span>
          <span className="neon4">T</span>
          <span> </span>
          <span className="neon5">A</span>
          <span className="neon6">P</span>
          <span className="neon7">P</span>
        </h1>
      </div>
      {!showChat ? (
        <form className="joinForm ">
          <div className="form-control">
            <div className="userWrapper">
              <div className="labelWrapper">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="userForm"
                  name="username"
                  placeholder="Enter Username"
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    event.key === "Enter" && joinRoom;
                  }}
                ></input>
              </div>
            </div>
          </div>
          <div className="form-control">
            <div className="roomWrapper">
              <div className="labelWrapper">
                <label htmlFor="room">Room</label>
              <select
                name="room"
                id="room"
                placeholder="Select Room ID"
                className="roomForm"
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              >
                <option value="">Select A Room</option>
                <option value="room1">Room 1</option>
                <option value="room2">Room 2</option>
                <option value="room3">Room 3</option>
                <option value="room4">Room 4</option>
                <option value="room5">Room 5</option>
              </select>
              </div>
            </div>
          </div>
          <button className="joinBtn" onClick={joinRoom}>
            Join
          </button>
        </form>
      ) : (
        <Chat setShowChat={setShowChat} room={room} username={username} />
      )}
    </div>
  );
}
