// src/stores/webrtc.js
import { defineStore } from 'pinia';
import WebSocketManager from '@/service/websocket/websocketManager';
import { number } from 'echarts';
export const useWebRTCStore = defineStore('webrtc', {
    state: () => ({
        peerConnections: {},
        connectionStates: {},
        currentUserId: (() => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                return user ? user.id : null;
            } catch (error) {
                console.error('Failed to parse user from localStorage', error);
                return null;
            }
        })(),
        RoomId: -1
    }),
    actions: {

        async getUserMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                return stream;
            } catch (error) {
                console.error('Error accessing media devices.', error);
                throw error;
            }
        },

        async createPeerConnection(targetUserId: number) {

            if (this.peerConnections[targetUserId]) {
                return this.peerConnections[targetUserId];
            }

            const configuration = {
                iceServers: [
                    {
                        urls: "stun:124.70.216.41:3578" // STUN 服务器
                    },
                    {
                        urls: "turn:124.70.216.41:3578", // TURN 服务器
                        username: "Henry",
                        credential: "zzh20010219"
                    }
                ]
            };



            const peerConnection = new RTCPeerConnection(configuration);

            if(targetUserId == this.currentUserId){
                // 获取音频流上传
                const stream = await this.getUserMedia();
                stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

                //下载
                peerConnection.ontrack = event => {
                    const remoteStream = event.streams[0];
                    const audioElement = document.createElement('audio');
                    audioElement.srcObject = remoteStream;
                    audioElement.play();
                };
            } else{
                //下载
                peerConnection.ontrack = event => {
                    const remoteStream = event.streams[0];
                    const audioElement = document.createElement('audio');
                    audioElement.srcObject = remoteStream;
                    audioElement.play();
                };
            }



            peerConnection.onicecandidate = event => {
                console.log('New ICE candidate:', event.candidate);
                if (event.candidate) {
                    const message = {
                        type: "candidate",
                        from: this.currentUserId,
                        to: targetUserId,
                        candidate: event.candidate,
                        roomId: this.roomId
                    }

                    this.sendSignalMessage(message);
                }
            };

            

            peerConnection.onconnectionstatechange = () => {
                this.connectionStates[targetUserId] = peerConnection.connectionState;
                console.log('connection state change', peerConnection.connectionState);
            };

            this.peerConnections[targetUserId] = peerConnection;

            //send init offer
            console.log("peerconnection added", targetUserId);

            return peerConnection;
        },
        getPeerConnection(targetUserId) {
            return this.peerConnections[targetUserId];
        },
        async createAndSendOffer(targetUserId: number) {
            const peerConnection = await this.createPeerConnection(targetUserId);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            const message = {
                type: "receiveVideoFrom",
                from: this.currentUserId,
                to: targetUserId,
                sdp: offer.sdp,
                roomId: this.roomId
            };

            this.sendSignalMessage(message);
        },
        joinRoom(roomId:number) {
            this.roomId = roomId;
            const message = {
                type: "joinRoom",
                from: this.currentUserId,
                roomId: this.roomId
            };

            this.sendSignalMessage(message);
        },
        sendSignalMessage(message) {
            const messageSent = ({
                content: JSON.stringify(message),
                messageType: 'RTCMsg'
            });
            // 发送信令消息的逻辑
            if (WebSocketManager.getInstance().isWebSocketConnected) {
                WebSocketManager.getInstance().sendMessage(messageSent);
            }
            else {
                console.error("websoket not connected");
            }

        },
        async handleSignalMessage(message) {
            const data = JSON.parse(message);
            if (data.to !== this.currentUserId) {
                return;
            }

            const targetUserId = data.to;
            let peerConnection = this.getPeerConnection(targetUserId);

            if (!peerConnection) {
                peerConnection = this.createPeerConnection(targetUserId);
            }
            console.error("什么情况");
            console.log(data);
            if (data.type === "offer") {
                /*
                await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.sdp }));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                this.sendSignalMessage({
                    type: "answer",
                    from: this.currentUserId,
                    to: targetUserId,
                    sdp: answer.sdp,
                    roomId: this.roomId
                });
                */
               console.error("Unknown type")
            } else if (data.type === "answer") {
                console.log("process answer")
                await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: data.sdp }));
            } else if (data.type === "iceCandidate") {
                console.log("process candidate")
                console.log(JSON.parse(data.candidate))
                const candidate = new RTCIceCandidate(JSON.parse(data.candidate));
                await peerConnection.addIceCandidate(candidate, function (error) {
                    if (error) {
                      console.error("Error adding candidate: " + error);
                      return;
                    }
                });
            } else if (data.type === "newParticipantArrived") {
                this.createAndSendOffer(data.from)
            }
        },


        isConnectionEstablished(targetUserId) {
            const state = this.connectionStates[targetUserId];
            return state === 'connected' || state === 'completed';
        },


        initializeConnections(users) {
            users.forEach(user => {
                if (user.id !== this.currentUserId) {
                    this.createPeerConnection(user.id);//createAndSendOffer(user.id);
                }
            });
        },
    }
});
