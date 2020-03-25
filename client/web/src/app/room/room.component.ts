import { Component, OnInit } from "@angular/core";
import * as io from "socket.io-client";
import { v4 } from "uuid";
import { ActivatedRoute } from "@angular/router";
import { RtcConn, WebRTCEffects } from "../store/effects/webrtc";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.css"]
})
export class RoomComponent implements OnInit {
  public localSrc = null;

  private socket: SocketIOClient.Socket;
  private local: RTCPeerConnection;
  private roomId: string;
  private userId: string;
  private peers: Set<string> = new Set();

  private rtcConn: RtcConn;

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(params => {
      this.roomId = params.roomId;
    });

    this.userId = v4();

    this.socket = io("localhost:3000");
  }

  ngOnInit(): void {
    this.socket.on("announce", ({ userId }) => {
      console.log(userId, "joined the room");
      this.peers.add(userId);
      this.socket.emit("announce", {
        roomId: this.roomId,
        userId: this.userId
      });
    });

    this.socket.on("message", envelope =>
      console.log(envelope.from, "says", envelope.message)
    );

    this.socket.emit("announce", { roomId: this.roomId, userId: this.userId });

    this.local = new RTCPeerConnection();

    this.socket.on("offer", (sdp: RTCSessionDescriptionInit) => {
      this.local.setRemoteDescription(sdp);
      console.log();
      this.socket.emit("answer", this.local.createAnswer());
    });

    this.socket.on("answer", offerAnswer => {
      this.local.setLocalDescription(offerAnswer);
    });

    this.local.createOffer().then(offer => {
      this.local.setLocalDescription(offer);
      this.socket.emit("offer", offer);
    });

    this.socket.emit("message", "hello room");

    // this.rtcConn = new RtcConn(null, this.socket);

    // this.startCapture();
  }
  /*
  private joinRoom(roomID, localStream) {
    const self = this;
    console.log("join", roomID);
    // disconnect from all peers in old room
    console.log("requesting to join", roomID);
    this.signalClient.discover(roomID);

    // get the peers in this room
    function onRoomPeers(discoveryData) {
      if (discoveryData.roomResponse === roomID) {
        console.log(discoveryData);
        self.signalClient.removeListener("discover", onRoomPeers);
        discoveryData.peers.forEach(peerID =>
          self.connectToPeer(peerID, roomID)
        ); // connect to all peers in new room;
      }
    }
    this.signalClient.addListener("discover", onRoomPeers);
  }

  private async connectToPeer(peerID, room) {
    console.log("connecting to peer", peerID);
    try {
      const { peer } = await this.signalClient.connect(
        peerID,
        room,
        this.peerConfig
      ); // connect to the peer
      console.log("connected to peer", peerID, peer);
      peer.emit("message", { to: peerID, message: "howdy" });
      this.onPeer(peer);
    } catch (e) {
      console.log("could not connect to peer:", peerID);
    }
  }

  onPeer(peer) {
    peer.on("message", payload => {
      console.log(peer, payload);
    });
  }
*/
  private startCapture() {
    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.localSrc = stream;

        const video = document.getElementById("video");
        // video.play();
      });
    }
  }
}
