import { useEffect, useState } from "react";
import { json } from '@remix-run/node'
import { Form } from "@remix-run/react";
import type { ChangeEvent, FormEvent } from "react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useSocket } from "~/context";
import {io } from "socket.io-client"

interface LoaderData {
  user: string
  users: string[]
}
export const action: ActionFunction = async ({ request }) => {
  // const user = await getSessionUser(request)
  const formData = await request.formData()
  const action = String(formData.get('_action'))

  // if (action === 'logout') {
  //   const session = await getSession(request.headers.get('Cookie'))
  //   return redirect('/', {
  //     headers: { 'Set-Cookie': await destroySession(session) },
  //   })
  // }

  if (action === 'send-message') {
    const message = String(formData.get('message'))
    if (message.length > 0) {
      // sendMessage(user, message)
      console.log(message)
    }
  }

  return null
}

export default function Index() {
  const [formValue, setFormValue] = useState("")
  const [messageVal, setMessageVal]= useState([])
  const socket = useSocket();
  const sendMessage = (message:string) => {
    socket?.emit("event", message)
    setMessageVal(prev => [...prev, message])
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    setFormValue(e.target.value);
    };

  useEffect(() => {
    if (!socket) return;

    socket.on("event", (data) => {
      console.log(`This is pingyPong from server  >>> ${data}`);
    });

    socket.emit("event", "ping");
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
          messageVal.length > 0 ?
          messageVal.map((message)=> 
          <ul>
            <li>{message}</li>
          </ul>
          )
          :"No Messages Yet!"}</div>
        </main>
        <div className="chat-form-container">
          <Form id="chat-form" method="post">
            <input
              id="msg"
              type="text"
              name="message"
              value={formValue}
              onChange={(e)=>handleChange(e,"message")}
              placeholder="Enter Message"
              required
              autoComplete="off"
            />
            <button 
            className="btn" 
            type="submit"
            name="_action"
            value="send-message"
            onClick={()=>sendMessage(formValue)}
            >
              Send
            </button>
          </Form>
        </div>
      </div>
      <button
        className="pingBtn"
      >
        Ping Socket
      </button>
      <p>{process.env.NODE_ENV}</p>
    </div>
  );
}
