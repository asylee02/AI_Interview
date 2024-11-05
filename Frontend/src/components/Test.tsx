import React, { useEffect, useState, useRef } from 'react';
import useDidUpdatingEffect from '@/hooks/UseDidupdatingEffect';
import { socket } from '@/utils/socket';
export default function Sex() {
  const [myStream, setmyStream] = useState<boolean>(false);
  const myPeerConnection = useRef<RTCPeerConnection>(null!);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const PeervideoRef = useRef<HTMLVideoElement>(null!);
  const roomname = '2';

  // 내 컴퓨터에서 Video와 Audio 가져오기
  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    console.log('getmedia', stream);
    
    videoRef.current.srcObject = stream;
    console.log(stream.getVideoTracks());
    console.log('getMedia');
  };

  // Socket 부분
  function joinRoom() {
    socket.emit('joinRoom', roomname);

    console.log('JoinRoom', roomname);
  }

  function makeConnection() {
    myPeerConnection.current = new RTCPeerConnection();

    myPeerConnection.current.addEventListener('icecandidate', handleIce);
    myPeerConnection.current.addEventListener('track', handleTrack);
    console.log('MakeConnection 부분', myPeerConnection.current);

    if (myStream) {
      myStream.getTracks().forEach((track) => {
        if (myPeerConnection.current) {
          myPeerConnection.current.addTrack(track, myStream);
        }
      });
    }
  }

  function handleIce(data: RTCPeerConnectionIceEvent) {
    console.log('Ice Candidate을 보냄');
    const ice = data.candidate;
    const room = roomname;
    if (ice) {
      socket.emit('ice', { room, ice });
      console.log(myPeerConnection.current);
    }
  }

  function handleTrack(data: RTCTrackEvent) {
    PeervideoRef.current.srcObject = data.streams[0];
  }

  function PushOffer() {
    socket.on('welcome', async (room: string) => {
      if (myPeerConnection.current) {
        const offer = await myPeerConnection.current.createOffer();
        myPeerConnection.current.setLocalDescription(offer);
        console.log('Peer A send offer');
        socket.emit('call-user', { room, offer });
      }
    });
  }

  function PushAnswer() {
    socket.on('call-made', async (offer: RTCSessionDescription, room: string) => {
      if (myPeerConnection.current) {
        console.log('offer 받음');
        myPeerConnection.current.setRemoteDescription(offer);
        const answer = await myPeerConnection.current.createAnswer();
        myPeerConnection.current.setLocalDescription(answer);
        console.log('Answer 보냄');
        socket.emit('call-answer', { room, answer });
      }
    });
  }

  function GetAnswer() {
    socket.on('answer-get', async (answer: RTCSessionDescription, room: string) => {
      if (myPeerConnection.current) {
        console.log('answer을 받음');
        myPeerConnection.current.setRemoteDescription(answer);
      }
    });
  }

  function Ice() {
    socket.on('ice', async (ice: RTCIceCandidate, room: string) => {
      console.log('iceCandidate을 받음');
      // iceCandidate을 처리하는 로직 추가
    });
  }

  useEffect(() => {
    console.log(socket);
    getMedia();
    setmyStream(true);
  }, []);

  useDidUpdatingEffect(() => {
    makeConnection();
    joinRoom();
    PushOffer();
    PushAnswer();
    GetAnswer();
    Ice();
  }, [myStream]);

  // 여기까지 Socket 부분 //

  // mute=true 나오는 부분 해결//

  return (
    <div>
      <div id="myStream">
        <video ref={videoRef} autoPlay={true} muted={true} playsInline={true} width={400} height={400} />
        <video ref={PeervideoRef} autoPlay={true} muted={true} playsInline={true} width={400} height={400} />
      </div>
    </div>
  );
}
