import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSocket } from "~/context";

interface ChatProps{
    webSocket:any;
    room?:string;
    username: string;
}
interface MsgDataProps{
  room: string;
  user: string;
  message: string;
  prev: null;
}

export default function Chat({webSocket, username, room}:ChatProps){
    const [formValue, setFormValue] = useState("");
    const [messageList, setMessageList] = useState<MsgDataProps[] | []>([]);
    const hourFormat =  new Date(Date.now()).getHours() - 12 >= 0 ? "pm" : "am"
    const hour = new Date(Date.now()).getHours() - 12 >= 0 ? new Date(Date.now()).getHours()- 12 : new Date(Date.now()).getHours() 
    const minutes = new Date(Date.now()).getMinutes()
    const socket = useSocket();
    
    const sendMessage = async (message: string) => {
        event?.preventDefault();
        if (message !== "") {
          const messageData = {
            room: room,
            user: username,
            message: message,
          };
          await webSocket?.emit("send-message", messageData);
          setMessageList((prev:any) => [
            ...prev,
            {user: messageData.user, message: messageData.message}
          ]);
        }
        setFormValue("");
      };
      const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        setFormValue(e.target.value);
      };
    
      useEffect(() => {
        if (!webSocket) return;
        webSocket.on("receive_message", (data:MsgDataProps) => {
          setMessageList((list) => [...list, data]);
        });
      }, [socket]);
      useEffect(() => {
        if (!webSocket) return;
        webSocket.on("message", (data:MsgDataProps) => {
          console.log(data)
          setMessageList((prev)=>[...prev,data])
        } );
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
            <h2 id="room-name">{room}</h2>
            <h3>Users</h3>
            <ul id="users"></ul>
          </div>
          <div className="chat-messages">
            {messageList.length > 0
              ? messageList.map(({message, user}, index) => (
                  <ul key={index}>
                    <div className={ user == "Server" ? "serverMsg": user==username ? "msgContainerMe" : "msgContainerOthers"}>
                    <h3 className="msgUser">{user}</h3>
                    <li className="msgMessage" style={{display:"flex"}}>{message}
                    <p className="msgTime">{`${hour}:${minutes} ${hourFormat}`}</p>
                    </li>
                    </div>
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