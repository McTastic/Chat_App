import { useState } from "react";
import { useSocket } from "~/context";
import Chat from "../components/chat";


export default function Index() {
  const[username, setUsername]= useState("")
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const socket = useSocket();

  const joinRoom = () => {
    event?.preventDefault;
    if (!socket) return;
    if (username !== "" && room !== "") {
      socket.emit("join_room", username, room);
      setShowChat(true);
    }else{
      window.alert("You need to enter a Room ID and a Username to continue.")
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          lineHeight: "1.4",
        }}
      >
        <h1 className="neon">
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
      {!showChat ?(
      <form className="joinForm ">
        <div className="form-control">
          <div className="userWrapper">
          <div className="labelWrapper">
          <label htmlFor="username">Username</label>
          </div>
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
        <div className="form-control">
          <div className="roomWrapper">
        <div className="labelWrapper">
          <label htmlFor="room">Room</label>
          </div>
          <input 
          name="room" 
          type="text"
          id="room" 
          placeholder="Enter a Room ID"
          className="roomForm"
          onChange={(event) => {
            setRoom(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && joinRoom;
          }}
          >
          </input>
          </div>
        </div>
        <button
        className="joinBtn"
        onClick={joinRoom} 
        >Join</button>
      </form>
      ):(
        <Chat webSocket ={socket} room={room} username={username}/>
      )
      }
    </div>
  );
}
