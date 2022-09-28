const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();
const server = http.createServer(app);

const io = new Server(server);
const userList = {};
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", (username, room) => {
    const user = {
      name: username,
      id: socket.id,
      room: room,
    };
    userList[socket.id] = user;
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", {
      user: "Server",
      message: `${username}, Welcome to the chat!`,
    });
    // Get users in a room
    const userArr = Object.values(userList);
    const checkRoom = (room) => {
      return userArr.filter((user) => user.room === room);
    };
    const roomUsers = checkRoom(user.room);
    io.to(user.room).emit("users", roomUsers);
    // Broadcast when user joins
    socket.broadcast.to(user.room).emit("message", {
      user: "Server",
      message: `${username} has joined the chat!`,
    });

    //Broadcast when client disconnects
    socket.on("disconnect", () => {
      io.to(user.room).emit("message", {
        user: "Server",
        message: `${username} has left the chat!`,
      });
      delete userList[socket.id];
      io.to(user.room).emit("userLeave", socket.id);
    });
  });

  // Listens for a message to be sent
  socket.on("send-message", (data) => {
    console.log(data);
    socket
      .to(data.room)
      .emit("receive_message", { user: data.user, message: data.message });
  });
  // When client disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Remix fingerprints its assets so we can cache forever.
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

app.use(morgan("tiny"));

app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? (req, res, next) => {
        purgeRequireCache();

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next);
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
