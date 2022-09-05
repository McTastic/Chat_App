import { useEffect, useState } from "react";
import { json } from '@remix-run/node'
import type { ChangeEvent } from "react";
import { useSocket } from "~/context";

interface LoaderData {
  user: string
  users: string[]
}

export default function Index() {
  const [formValue, setFormValue] = useState("")
  const [messageList, setMessageList] = useState([])
  const hour = new Date(Date.now()).getHours() -12
  const socket = useSocket();
  const sendMessage = async (message:string) => {
    event?.preventDefault()
    if (message !== "") {
      const messageData = {
        message: message,
        time:
          hour +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
    await socket?.emit("send-message", messageData)
    setMessageList(prev => [...(prev || []), `${messageData.time}: ${messageData.message}`])
  };
  setFormValue("");
}
  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setFormValue(e.target.value);
    };

  // useEffect(() => {
  //   if (!socket) return;

  //   // socket.on("event", (data) => {
  //   //   console.log(`This is pingyPong from server  >>> ${data}`);
  //   // });
  //   socket.on("send-message", (data)=>{
  //     console.log(`The message sent is ====> ${data}`)
  //   })

  //   // socket.emit("event", "ping");
  // }, [socket]);

  useEffect(() => {
    if(!socket) return;
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

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
      {/* <form className="chat">
        <div className="form-control">
          <label for="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
          ></input>
        </div>
        <div class="form-control">
          <label for="room">Room</label>
          <select name="room" id="room">
            <option value="Room1">1</option>
            <option value="Room2">2</option>
            <option value="Room3">3</option>
            <option value="Room4">4</option>
            <option value="Room5">5</option>
            <option value="Room6">6</option>
          </select>
        </div>
      </form> */}
      <div className="chat-container">
        <header className="chat-header">
          <h1>Chat App!</h1>
          <a id="leave-btn" className="btn">
            Leave Room
          </a>
        </header>
        <main className="chat-main">
          <div className="chat-sidebar">
            <h3>Room Name:</h3>
            <h2 id="room-name"></h2>
            <h3>Users</h3>
            <ul id="users"></ul>
          </div>
          <div className="chat-messages">{
          messageList.length > 0 ?
          messageList.map((message, index)=> 
          <ul key={index}>
            <li>{message}</li>
          </ul>
          )
          :"No Messages Yet!"}</div>
        </main>
        <div className="chat-form-container">
          <div id="chat-form" >
            <div className="inputContainer">
            <input
              id="msg"
              className="chatInput"
              type="text"
              name="message"
              value={formValue}
              onChange={(e)=>handleChange(e,"message")}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage(formValue);
              }}
              placeholder="Enter Message"
              required
              autoComplete="off"
            />
            <button 
            className="btn" 
            type="button"
            value="send-message"
            onClick={()=>sendMessage(formValue)}
            >
              Send
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
