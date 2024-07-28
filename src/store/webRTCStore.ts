// src/stores/webrtc.js
import { defineStore } from 'pinia';
import WebSocketManager from '@/service/websocket/websocketManager';
import { ref } from 'vue';
import {useRoomStore} from '@/store/RoomStore'

const getDefaultState = () => ({
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
    RoomId: -1,
    selectedDevice: null,

    gainNodes: {}, // 存储每个用户的 GainNode 实例
    audioContexts: {}, // 存储每个用户的 AudioContext 实例
    audioElement: {}
});

export const useWebRTCStore = defineStore('webrtc', {
    state: getDefaultState,
    actions: {

        //音量增益设置
        // 初始化 GainNode
        initGainNode(userId, stream) {
            const audioContext = new (window.AudioContext)();
            const gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            this.audioContexts[userId] = audioContext;
            this.gainNodes[userId] = gainNode;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(gainNode);

            const audioElement = document.createElement('audio');
            audioElement.srcObject = stream;
            audioElement.volume = 0.5
            audioElement.play();
            this.audioElement[userId] = audioElement;
        },

        // 设置增益
        setGain(userId, value) {
            if (userId !== this.currentUserId)
                this.audioElement[userId].volume = value;
            if (this.gainNodes[userId]) {
                console.log(value)
                this.gainNodes[userId].gain.value = value;
            } else {
                console.error(`GainNode for user ${userId} not found`);
            }
        },
        resetWebRtcStore() {
            Object.assign(this.$state, getDefaultState());
        },

        async getUserMedia() {

            let stream;
            try {

                if (this.selectedDevice) {
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({
                            audio: {
                                echoCancellation: true,
                                noiseSuppression: true,
                                autoGainControl: true,
                                deviceId: { exact: this.selectedDevice }
                            }
                        });
                        console.log("Selected device stream:", stream);
                    } catch (error) {
                        console.warn("Failed to get media stream with selected device, trying default device.", error);
                        stream = await navigator.mediaDevices.getUserMedia({
                            audio: {
                                echoCancellation: true,
                                noiseSuppression: true,
                                autoGainControl: true,
                            }
                        });
                        console.log("Default device stream 1:", stream);
                    }
                } else {
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true,
                        }
                    });
                    console.log("Default device stream 2:", stream);
                }
                // 在这里处理 stream，例如播放音频，或者传递给其他处理函数
            } catch (error) {
                console.error("Error accessing the audio devices: ", error);
            }
            return stream;
        },

        async replaceStream(peerConnection, newStream) {
            // 获取当前的发送者（RTCRtpSender）
            const senders = peerConnection.getSenders();

            // 遍历每个发送者并替换轨道
            senders.forEach(sender => {
                // 获取当前发送者的轨道类型（音频或视频）
                const trackKind = sender.track.kind;

                // 从新的流中找到同类型的轨道
                const newTrack = newStream.getTracks().find(track => track.kind === trackKind);

                if (newTrack) {
                    // 用新的轨道替换发送者的旧轨道
                    sender.replaceTrack(newTrack);
                }
            });
        },

        async createPeerConnection(targetUserId: number) {

            if (this.peerConnections[targetUserId]) {
                return this.peerConnections[targetUserId];
            }

            const configuration = {
                iceServers: [
                    {
                        urls: "stun:124.70.216.41:3478" // STUN 服务器
                    },
                    {
                        urls: "turn:124.70.216.41:3478", // TURN 服务器
                        username: "Henry",
                        credential: "zzh20010219"
                    }
                ]
            };



            const peerConnection = new RTCPeerConnection(configuration);

            if (targetUserId == this.currentUserId) {
                // 获取音频流上传
                // const stream = await this.getUserMedia();
                // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

                try {
                    const stream = await this.getUserMedia();

                    const audioContext = new (window.AudioContext)();
                    const gainNode = audioContext.createGain();
                    gainNode.gain.value = 1; // 初始增益为1
                    this.audioContexts[targetUserId] = audioContext;
                    this.gainNodes[targetUserId] = gainNode;

                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(gainNode);
                    const destinationStream = audioContext.createMediaStreamDestination();
                    gainNode.connect(destinationStream);

                    const newStream = destinationStream.stream;

                    newStream.getAudioTracks().forEach(track => peerConnection.addTrack(track, newStream));



                    // 创建音频上下文和增益节点
                    /*
                    const audioContext = new (window.AudioContext)();
                    const gainNode = audioContext.createGain();
                    gainNode.gain.value = 0.5;
                    this.audioContexts[targetUserId] = audioContext;
                    this.gainNodes[targetUserId] = gainNode;
                    // 创建媒体流源并连接到增益节点
                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    // 创建一个新的媒体流从增益节点
                    const destination = audioContext.createMediaStreamDestination();
                    gainNode.connect(destination);
                    const newStream = destination.stream;


                    newStream.getAudioTracks().forEach(track => peerConnection.addTrack(track, newStream));*/
                } catch (error) {
                    console.error('Error accessing media devices.', error);
                }


            } else {
                //下载
                peerConnection.ontrack = event => {
                    const remoteStream = event.streams[0];
                    // const audioElement = document.createElement('audio');
                    // audioElement.srcObject = remoteStream;
                    // audioElement.play();
                    this.initGainNode(targetUserId, remoteStream);
                };
                // 创建一个空的音频轨道并添加到PeerConnection中
                const audioContext = new (window.AudioContext)();
                const destination = audioContext.createMediaStreamDestination();
                const emptyAudioTrack = destination.stream.getAudioTracks()[0];
                peerConnection.addTrack(emptyAudioTrack, destination.stream);
            }




            peerConnection.onicecandidate = event => {
                console.log('New ICE candidate:', event.candidate);
                if (event.candidate) {
                    const message = {
                        type: "onIceCandidate",
                        from: this.currentUserId,
                        to: targetUserId,
                        candidate: event.candidate,
                        roomId: this.roomId
                    }

                    this.sendSignalMessage(message);
                }
            };



            peerConnection.onconnectionstatechange = () => {
                if (peerConnection === this.peerConnections[targetUserId]) {
                    this.connectionStates[targetUserId] = peerConnection.connectionState;
                    console.log('connection state change', peerConnection.connectionState);
                }

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
            console.log("offer", offer, peerConnection);
            const message = {
                type: "receiveVideoFrom",
                from: this.currentUserId,
                to: targetUserId,
                sdp: offer.sdp,
                roomId: this.roomId
            };

            this.sendSignalMessage(message);
        },
        joinRoom(roomId: number) {
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

            const targetUserId = data.from;
            let peerConnection = this.getPeerConnection(targetUserId);

            if (!peerConnection) {
                peerConnection = this.createPeerConnection(targetUserId);
            }
            // console.error("什么情况");
            // console.log(data);
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
                // console.log(JSON.parse(data.candidate))
                const candidate = new RTCIceCandidate(JSON.parse(data.candidate));
                await peerConnection.addIceCandidate(candidate, function (error) {
                    if (error) {
                        console.error("Error adding candidate: " + error);
                        return;
                    }
                });
            } else if (data.type === "newParticipantArrived") {
                this.createAndSendOffer(data.from)
            } else if (data.type === "existingParticipants") {
                const users = useRoomStore().getRoomById(useRoomStore().currentActive).onlineUsers;
                if(users.size == null)
                    return;
                users.value.forEach(userId => {
                    if (userId !== this.currentUserId) {
                        this.createAndSendOffer(userId);
                    }
                });
            }
        },


        isConnectionEstablished(targetUserId) {
            const state = this.connectionStates[targetUserId];
            return state === 'connected' || state === 'completed';
        },
        getConnectionState(targetUserId) {
            return this.connectionStates[targetUserId];
        },


        initializeConnections(users) {
            users.forEach(user => {
                if (user.id !== this.currentUserId) {
                    this.createPeerConnection(user.id);//createAndSendOffer(user.id);
                }
            });
        },

        async setDeviceId(deviceId) {
            this.selectedDevice = deviceId;
            if (this.getPeerConnection(this.currentUserId) && this.getConnectionState(this.currentUserId) === 'connected') {
                const stream = await this.getUserMedia();
                this.replaceStream(this.getPeerConnection(this.currentUserId), stream);
                console.log("replaceStream succeed");
            }
            else {
                console.error("replaceStream failed");
            }
        }
    }
});
