import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSocket } from "~/context";

interface ChatProps{
    webSocket?:string;
    room?:string;
    username: string;
}

export default function Chat({webSocket, username, room}){
    const [formValue, setFormValue] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [roomName, setRoomName] = useState("");
    const hour = new Date(Date.now()).getHours() - 12 >= 0 ? new Date(Date.now()).getHours() : new Date(Date.now()).getHours()
    const socket = useSocket();
    
    const sendMessage = async (message: string) => {
        event?.preventDefault();
        if (message !== "") {
          const messageData = {
            room: room,
            author: username,
            message: message,
            time: hour + ":" + new Date(Date.now()).getMinutes(),
          };
          await webSocket?.emit("send-message", messageData);
          setMessageList((prev) => [
            ...(prev || []),
            `${messageData.author}:${messageData.time} ____ ${messageData.message}`,
          ]);
        }
        setFormValue("");
      };
      const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        setFormValue(e.target.value);
      };
    
      useEffect(() => {
        if (!webSocket) return;
        webSocket.on("receive_message", (data) => {
          setMessageList((list) => [...list, data]);
        });
      }, [socket]);

    return(
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
            <h2 id="room-name">{roomName}</h2>
            <h3>Users</h3>
            <ul id="users"></ul>
          </div>
          <div className="chat-messages">
            {messageList.length > 0
              ? messageList.map((message, index) => (
                  <ul key={index}>
                    <li>{message}</li>
                  </ul>
                ))
              : "No Messages Yet!"}
          </div>
        </main>
        <div className="chat-form-container">
          <div id="chat-form">
            <div className="inputContainer">
              <input
                id="msg"
                className="chatInput"
                type="text"
                name="message"
                value={formValue}
                onChange={(e) => handleChange(e, "message")}
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
                onClick={() => sendMessage(formValue)}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}