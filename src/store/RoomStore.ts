import { defineStore } from 'pinia';
import axios from 'axios';
import { useMessageStore } from '@/store/MessageStore';
import { GetRoomsInfo } from '@/api/room'
export const useRoomStore = defineStore('rooms', {
    state: () => ({
        rooms: [
            // {
            //     roomId: 1,
            //     roomName: '世界频道',
            //     avatar: 'http://124.70.216.41:9000/vvoice/20240704/bafe0d5855e443b3b8de35f9b0881fb7',
            //     description: 'This is the general room.',
            //     onlineUsers:[],
            // },
            // {
            //     roomId: 2,
            //     roomName: '瓦',
            //     avatar: 'http://124.70.216.41:9000/vvoice/20240704/bafe0d5855e443b3b8de35f9b0881fb7',
            //     description: 'Room for development discussions.',
            //     onlineUsers:[],
            // },
            // {
            //     roomId: 3,
            //     roomName: '英雄联盟英雄联盟英雄联盟',
            //     avatar: 'http://124.70.216.41:9000/vvoice/20240704/bafe0d5855e443b3b8de35f9b0881fb7',
            //     description: 'Room for design discussions.',
            //     onlineUsers:[],
            // },
        ],
        currentActive: 1,
    }),
    getters: {
        getRoomById: (state) => (roomId) => {
            return state.rooms.find(room => room.roomId === roomId);
        },
    },
    actions: {
        async fetchRooms() {
            console.log("loading rooms info");
            const { code, message, data } = (await GetRoomsInfo()).data
            if (code === 200) {
                // this.rooms = data.map(room => ({
                //     ...room,
                //     onlineUsers: [],
                // }));
                this.rooms = data
            } else {
                console.log("Failed to fetch rooms info:" + message);
            }

        },

        setActiveId(ActiveId: number) {
            this.currentActive = ActiveId;
            useMessageStore().InitMessage();
            useMessageStore().fetchMessagesByRoomId(ActiveId);
        },

        // async updateOnlineUsers(roomId, userIds) {
        //     const room = this.rooms.find(r => r.roomId === roomId);
        //     if (room) {
        //         room.onlineUsers = userIds;
        //     }
        // },
    }
});
