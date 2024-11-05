'use client';
import useDidUpdatingEffect from '@/hooks/UseDidupdatingEffect';
import { socket } from '@/utils/socket';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  id: string;
};

export default function Test2() {
  const [myStream, setMyStream] = useState<MediaStream>(null!);

  const myPeerConnection = useRef<RTCPeerConnection>(null!);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const PeerVideoRef = useRef<HTMLVideoElement>(null!);
    const id = "3";
   useDidUpdatingEffect(() => {
     console.log(socket);
     getMedia();
   }, []);

   useDidUpdatingEffect(() => {
     socket.emit('leave', id);
     makeConnection();
     joinRoom();
     PushOffer();
     PushAnswer();
     getAnswer();
     Ice();
   }, [myStream]);

  const getMedia = async () => {
    const MyStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    console.log('🚀 ~ getMedia ~ MyStream:', MyStream);
    setMyStream(MyStream);
    videoRef.current.srcObject = MyStream;
    console.log('🚀 ~ getMedia ~ videoRef.current.srcObject:', videoRef.current.srcObject);
  };

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
    const room = id;
    if (ice) {
      socket.emit('ice', { room, ice });
      console.log(myPeerConnection.current);
    }
  }

  function handleTrack(data: RTCTrackEvent) {
    PeerVideoRef.current.srcObject = data.streams[0];
  }

  console.log('MakeConnection 부분', myPeerConnection.current);

  const joinRoom = () => {
    socket.emit('joinRoom', id);
    console.log('JoinRoom', id, '에입장');
  };

  const PushOffer = () => {
    socket.on('welcome', async (room: string) => {
      const offer = await myPeerConnection.current.createOffer();
      myPeerConnection.current.setLocalDescription(offer);
      console.log('Peer A send offer');
      socket.emit('call-user', { room, offer });
    });
  };

  function PushAnswer() {
    socket.on('call-made', async (offer: RTCSessionDescription, room: string) => {
      console.log(myPeerConnection.current);
      if (myPeerConnection.current) {
        myPeerConnection.current.setRemoteDescription(offer);
        const answer = await myPeerConnection.current.createAnswer();
        myPeerConnection.current.setLocalDescription(answer);
        console.log('Answer 보냄');
        socket.emit('call-answer', { room, answer });
      }
    });
  }

  const getAnswer = () => {
    socket.on('answer-get', async (answer: RTCSessionDescription, room: string) => {
      console.log('answer 받음', answer);
      myPeerConnection.current.setRemoteDescription(answer);
    });
  };
  const Ice = () => {
    socket.on('ice', (ice: RTCIceCandidate, room: string) => {
      console.log('iceCandidate을 받음');
      // iceCandidate을 처리하는 로직 추가
    });
  };

  return (
      <div className="bg-gray-300 flex gap-x-10">
          
      <video ref={videoRef} autoPlay={true} muted={true} playsInline={true} className="w-52 border border-black" />

      <video ref={PeerVideoRef} autoPlay={true} muted={true} playsInline={true} className="w-52 border border-black" />
    </div>
  );
}
