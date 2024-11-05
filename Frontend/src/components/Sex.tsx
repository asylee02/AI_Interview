'use client';
import useDidUpdatingEffect from '@/hooks/UseDidupdatingEffect';
import { socket } from '@/utils/socket';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  id: string;
};

export default function Sex({ id }: Props) {
  const [myStream, setMyStream] = useState<MediaStream>(null!);

  const myPeerConnection = useRef<RTCPeerConnection>(null!);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const PeerVideoRef = useRef<HTMLVideoElement>(null!);

  useDidUpdatingEffect(() => {
    socket.emit('leave', id);
    console.log('Effect started');
    async function setupConnection() {
      console.log('getMedia');
      await getMedia();
      console.log('makeConnection');
      makeConnection();
      console.log('joinRoom');
      joinRoom();
      console.log('PushOffer');
      await PushOffer();
      console.log('PushAnswer');
      await PushAnswer();
      console.log('getAnswer');
      getAnswer();
      console.log('Ice');
      Ice();
    }
    setupConnection();
  }, [id]);

  const getMedia = async () => {
    const MyStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    console.log('🚀 ~ getMedia ~ MyStream:', MyStream);
    setMyStream(MyStream);
    videoRef.current.srcObject = MyStream;
    console.log('🚀 ~ getMedia ~ videoRef.current.srcObject:', videoRef.current.srcObject);
  };

  const makeConnection = async () => {
    const iceServers = [
      {
        urls: ['stun:stun.l.google.com:19302'],
      },
    ];

    // myPeerConnection.current.onicecandidate('icecandidate', handleIce);
    const peerConnection = new RTCPeerConnection({ iceServers });

    // ICE Candidate 이벤트 핸들링
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const ice = event.candidate;
        const room = id;
        if (ice) {
          socket.emit('ice', { room, ice });
          console.log(myPeerConnection.current);
        }
      }
    };

    peerConnection.ontrack = (event) => {
      if (PeerVideoRef.current) {
        PeerVideoRef.current.srcObject = event.streams[0];
      }
    };

    console.log('MakeConnection 부분', myPeerConnection.current);

    if (myStream) {
      myStream.getTracks().forEach((track) => {
        if (myPeerConnection.current) {
          myPeerConnection.current.addTrack(track, myStream);
        }
      });
    }
  };
  // function handleIce(data: RTCPeerConnectionIceEvent) {
  //   console.log('Ice Candidate을 보냄');
  //   const ice = data.candidate;
  //   const room = id;
  //   if (ice) {
  //     socket.emit('ice', { room, ice });
  //     console.log(myPeerConnection.current);
  //   }
  // }

  // function handleTrack(data: RTCTrackEvent) {
  //   PeerVideoRef.current.srcObject = data.streams[0];
  // }

  console.log('MakeConnection 부분', myPeerConnection.current);

  if (myStream) {
    myStream.getTracks().forEach((track) => {
      if (myPeerConnection.current) {
        myPeerConnection.current.addTrack(track, myStream);
      }
    });
  }

  const joinRoom = () => {
    socket.emit('joinRoom', id);
    console.log('JoinRoom', id, '에입장');
  };

  const PushOffer = () => {
    socket.emit('welcome', async (room: string) => {
      const offer = await myPeerConnection.current.createOffer();
      myPeerConnection.current.setLocalDescription(offer);
      console.log('Peer A send offer');
      socket.emit('call-user', { room, offer });
    });
  };

  const PushAnswer = () => {
    socket.on('call-made', async (offer: RTCSessionDescription, room: string) => {
      console.log('offer 받음');
      myPeerConnection.current.setRemoteDescription(offer);
      const answer = await myPeerConnection.current.createAnswer();
      myPeerConnection.current.setLocalDescription(answer);
      console.log('Answer 보냄', answer);
      socket.emit('call-answer', { room, answer });
    });
  };

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

      <video ref={videoRef} autoPlay={true} muted={true} playsInline={true} className="w-52 border border-black" />
    </div>
  );
}
