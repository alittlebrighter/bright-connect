import { Server } from "socket.io";

const users = {};

const announceExit = sock => {
  if (!users[sock.id]) {
    return;
  }

  sock.broadcast.to(users[sock.id]).emit("exit", sock.id);
};

export const startSimpleSignal = (io: Server) => {
  io.on("connection", socket => {
    console.log("a user connected");

    socket.on("announce", ({ roomId }) => {
      announceExit(socket);
      socket.leaveAll();

      socket.join(roomId);
      users[socket.id] = roomId;
      socket.broadcast
        .to(roomId)
        .emit("announce", { roomId, userId: socket.id });
    });

    socket.on("message", message =>
      socket.broadcast
        .to(users[socket.id])
        .emit("message", { from: socket.id, message })
    );

    socket.on("offer", offer =>
      socket.broadcast
        .to(users[socket.id])
        .emit("offer", { from: socket.id, offer })
    );

    socket.on("answer", offer =>
      socket.broadcast.to(users[socket.id]).emit("answer", {
        from: socket.id,
        offer
      })
    );

    io.on("disconnect", _ => announceExit(socket));

    /*
    socket.on("localDescription", {localDesc =>
      console.log("localDescription:", JSON.stringify(localDesc))
    );
    */
  });
};
