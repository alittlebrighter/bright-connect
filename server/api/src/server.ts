import express, { Request, Response } from "express";
import * as http from "http";
import socketio from "socket.io";
import cors from "cors";
import { startSimpleSignal } from "./signal";

const app = express();
const server = http.createServer(app);

const io = socketio();
io.attach(server);

startSimpleSignal(io);
//io.on("connection", startSimpleSignal);
/*
io.on("connection", client => {
  console.log("user connected");
  client.on("discover", obj =>
    console.log("user discover", JSON.stringify(obj))
  );
});
*/
const port = 3000;

app.get("/", (req: Request, res: Response) => res.send("hello world"));

app.use(cors({ origin: "localhost:4200" }));

server.listen(port, () =>
  console.log(`bright-connect-server listening on port ${port}!`)
);
