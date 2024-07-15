import { defineStore } from 'pinia';
import axios from 'axios';
import { GetUserInfoByIds } from '@/api/user'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userMap: new Map()
    }),
    getters: {
        getUserById: (state) => (userId) => {
            // console.log("inlog" + state.userMap.get(userId))
            return state.userMap.get(userId);
        },
        userExists: (state) => (userId) => {
            // console.log("check exists:" + userId)
            return state.userMap.has(userId) && state.userMap.get(userId) !== null;
        }
    },
    actions: {
        initUser(userId) {
            // console.log("initUser:" + userId)
            this.userMap.set(userId, null);
        },
        addUser(user) {
            this.userMap.set(user.id, user);
        },
        removeUser(userId) {
            this.userMap.delete(userId);
        },

        async updateAllUsersInfo() {
            const userIds = Array.from(this.userMap.keys());
            const dataToSend = JSON.stringify(userIds);
            // console.log(dataToSend)

            /*
                private Integer id;
                private String username;
                private String password;
                private String name;
                private String email;
                private String phone;
                private String avatar;
                private String description;
                private Integer status;
            */
            const { code, message, data } = (await GetUserInfoByIds(dataToSend)).data;
            if (code === 200) {
                data.forEach(user => {
                    this.userMap.set(user.id, user);
                });

                console.log('All users updated successfully.');;
            } else {
                console.log('Failed to update all users:', message);;
            }
            // 3. 更新用户信息到 store 中


        },

        async getUserOrDefault(userId) {
            if(this.userExists(userId))
                return this.getUserById(userId);
            this.initUser(userId);
            await this.updateAllUsersInfo();
            const user =  this.getUserById(userId)
            return user;
        }
    }
});