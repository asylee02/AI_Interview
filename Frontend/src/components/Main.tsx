import React, { useEffect, useState, useRef, useContext } from 'react';

import MyContext from '@/context/Mycontext';
import useDidupdatingEffect from '@/hooks/UseDidupdatingEffect';
import Alert from '@/components/Alert';
import Room from '@/components/Room';
import { socket } from '@/utils/socket';
import PeerVideo from './atoms/PeerVideo';
import Controler from './atoms/Controler';

export default function Main() {
  const [myStream, setMyStream] = useState<MediaStream>(null!);
  const myPeerConnection = useRef<RTCPeerConnection>(null!);
  const confirmVideo = useRef<HTMLVideoElement>(null!);
  const videoRef = useRef<HTMLVideoElement>(null!);
  const PeerVideoRef = useRef<HTMLVideoElement>(null!);
  const PeerStream = useRef<MediaStream>(null!);
  const [confirm, setConfirm] = useState<boolean>(false);
  const { hidden, roomName: roomName } = useContext(MyContext);

  // 내 컴퓨터에서 Video와 Audio 가져오기
  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    console.log('getMedia', stream);
    setMyStream((prevStream) => {
      if (videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = stream;
        if (confirmVideo.current) {
          confirmVideo.current.srcObject = stream;
        }
      }
      return stream;
    });
    console.log(stream.getVideoTracks());
  };

  // Socket 부분
  function joinRoom() {
    if (roomName.current == null || roomName.current === '') {
      // 빈 내용이라면 아무것도 하지 않음
    } else {
      socket.emit('joinRoom', roomName.current);
    }
    console.log('JoinRoom', roomName.current);
  }

  function makeConnection() {
    myPeerConnection.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302'],
        },
      ],
    });

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
    console.log(data);
    console.log(data.candidate);
    const ice = data.candidate;
    const room = roomName.current;
    if (ice) {
      socket.emit('ice', { room, ice });
      console.log(myPeerConnection.current);
    }
  }

  function handleTrack(data: RTCTrackEvent) {
    if (PeerVideoRef.current) {
      PeerVideoRef.current.srcObject = data.streams[0];
    }
    console.log(data.streams[0]);
    PeerStream.current = data.streams[0];
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
    return () => {
      console.log('getMedia 랜더링');
      getMedia();
    };
  }, [hidden]);
  useEffect(() => {
    return () => {
      console.log('Socket들 랜더링');
      makeConnection();
      joinRoom();
      PushOffer();
      PushAnswer();
      GetAnswer();
      Ice();
    };
  }, [myStream]);

  // 여기까지 Socket 부분 //

  // mute=true 나오는 부분 해결//
  function back() {
    const room = roomName.current;
    socket.emit('leave', room);
    console.log(socket.id, '가 방을 떠났습니다.');
    socket.emit('joinRoom', room);
    setConfirm(true);
    console.log(confirm);
  }

  return (
    <div>
      <div id="myStream" hidden={!hidden}>
        <div id="confirm" hidden={confirm}>
          <PeerVideo videoRef={confirmVideo} />
          <div id="confirm_button" className="flex justify-center items-center">
            <Controler myStream={myStream} />
            <button onClick={back}>입장</button>
          </div>
        </div>
        <Room myStream={myStream} hidden={!confirm} videoRef={videoRef} PeervideoRef={PeerVideoRef} />
      </div>
    </div>
  );
}
