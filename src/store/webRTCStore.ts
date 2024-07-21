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
        })()
    }),
    actions: {
        createPeerConnection(targetUserId:number) {

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

            peerConnection.onicecandidate = event => {
                console.log('New ICE candidate:', event.candidate);
                if (event.candidate) {
                    const message = {
                        type: "candidate",
                        from: this.currentUserId,
                        to: targetUserId,
                        candidate: event.candidate
                    }

                    this.sendSignalMessage(message);
                }
            };

            peerConnection.ontrack = event => {
                const remoteStream = event.streams[0];
                const audioElement = document.createElement('audio');
                audioElement.srcObject = remoteStream;
                audioElement.play();
            };

            peerConnection.onconnectionstatechange = () => {
                this.connectionStates[targetUserId] = peerConnection.connectionState;
                console.log('connection state change',  peerConnection.connectionState);
            };

            this.peerConnections[targetUserId] = peerConnection;
            return peerConnection;
        },
        getPeerConnection(targetUserId) {
            return this.peerConnections[targetUserId];
        },
        async createAndSendOffer(targetUserId:number) {
            const peerConnection = this.createPeerConnection(targetUserId);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            
            const message = {
                type: "offer",
                from: this.currentUserId,
                to: targetUserId,
                sdp: offer.sdp
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
            console.log("data:", data)
            if (data.to !== this.currentUserId) {
                return;
            }

            const targetUserId = data.from;
            let peerConnection = this.getPeerConnection(targetUserId);

            if (!peerConnection) {
                peerConnection = this.createPeerConnection(targetUserId);
            }

            if (data.type === "offer") {
                await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: data.sdp }));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                this.sendSignalMessage({
                    type: "answer",
                    from: this.currentUserId,
                    to: targetUserId,
                    sdp: answer.sdp
                });
            } else if (data.type === "answer") {
                await peerConnection.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: data.sdp }));
            } else if (data.type === "candidate") {
                const candidate = new RTCIceCandidate(data.candidate);
                await peerConnection.addIceCandidate(candidate);
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
