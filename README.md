## Bright Connect - WIP
Yet another group chat/audio/video communication platform.

### What's here so far
`server/api` - NodeJS server written in Typescript using ExpressJS and SocketIO
`client/web` - Angular web app with NGRX

Everything's messy at the moment but basic communication by rooms are working.

### Roadmap
This will be a centrallized chat platform.  WebRTC sounded great but since most everyone is behind a NAT it all gets centralized via a STUN/TURN server anyways.  The plan would be to ship all media streams for each chat session to a server where they will get merged (probably by ffmpeg) and redistributed.  This way there can be one stream sent back to all users which should be relatively memory efficient.  Audio should be relatively easy since we're just overlaying multiple tracks and video just requires stitching each video stream into a different portion of the resulting image in a grid.  Streaming to the server will require the use of web workers so the main thread can worry about the UI.  Another feature that would be nice to have is the ability to synchronize video watching for all chat participants.
