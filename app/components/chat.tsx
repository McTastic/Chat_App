import { useEffect, useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { useSocket } from "~/context";
import ScrollToBottom from "react-scroll-to-bottom";
import { useResolvedPath } from "@remix-run/react";

interface ChatProps {
  webSocket: any;
  room?: string;
  username: string;
}
interface MsgDataProps {
  room: string;
  user: string;
  message: string;
  prev: null;
}

export default function Chat({ webSocket, username, room }: ChatProps) {
  const [formValue, setFormValue] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [messageList, setMessageList] = useState<MsgDataProps[] | []>([]);
  const hourFormat = new Date(Date.now()).getHours() - 12 >= 0 ? "pm" : "am";
  const hour =
    new Date(Date.now()).getHours() - 12 >= 0
      ? new Date(Date.now()).getHours() - 12
      : new Date(Date.now()).getHours();
  const minutes = new Date(Date.now()).getMinutes();
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
      setMessageList((prev: any) => [
        ...prev,
        { user: messageData.user, message: messageData.message },
      ]);
    }
    setFormValue("");
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setFormValue(e.target.value);
  };

  useEffect(() => {
    if (!webSocket) return;
    webSocket.on("message", (data: MsgDataProps) => {
      console.log(data);
      setMessageList((prev) => [...prev, data]);
    });
    webSocket.on("receive_message", (data: MsgDataProps) => {
      setMessageList((list) => [...list, data]);
    });

  }, [socket]);
  useMemo(()=>{
    webSocket.on("users", (users:any) => setRoomList(users))
    // webSocket.on("connected", (user:any) =>{
    //   setRoomList(prev =>[...prev, user])})
  },[]); 

  console.log(roomList);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Chat App!</h1>
        <a id="leave-btn" className="btn" href="/">
          Leave Room
        </a>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>Room Name:</h3>
          <h2 id="room-name">{room}</h2>
          <h3>Users</h3>
            {roomList.map(({ name, id,room }, index) => (
          <ul key={id} id="users">
            {/* {room==room ? (
              <li>{name}</li>
            ): <li></li>} */}
            {name}- Room {room}
          </ul>
            ))}
        </div>
        <ScrollToBottom className="chat-messages">
          {messageList.length > 0
            ? messageList.map(({ message, user }, index) => (
                <ul key={index} className="messageWrapper">
                  <div
                    className={
                      user == "Server"
                        ? "serverMsg"
                        : user == username
                        ? "msgContainerMe"
                        : "msgContainerOthers"
                    }
                  >
                    <h3 className="msgUser">{user}</h3>
                    <li className="msgMessage" style={{ display: "flex" }}>
                      {message}
                      <p className="msgTime">{`${hour}:${minutes} ${hourFormat}`}</p>
                    </li>
                  </div>
                </ul>
              ))
            : "No Messages Yet!"}
        </ScrollToBottom>
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
  );
}
