export const onicecandidateFactory = (other: RTCPeerConnection) => event =>
  !event.candidate ||
  other
    .addIceCandidate(event.candidate)
    .catch(addIceErr =>
      console.warn("error (local): onicecandidate:", addIceErr)
    );

export class RtcConn {
  local: RTCPeerConnection;
  data: RTCDataChannel;

  constructor(
    private config: RTCConfiguration,
    signaler: SocketIOClient.Socket
  ) {
    this.local = new RTCPeerConnection(config);

    this.local
      .createOffer()
      .then(offer => this.local.setLocalDescription(offer));
  }
}

export class WebRTCEffects {
  static readonly peerConfig = {
    iceServers: [
      {
        urls: ["stuns:stun3.l.google.com:19302"]
      },
      {
        urls: ["turn:192.81.209.186:3478"]
      }
    ]
  };
}
