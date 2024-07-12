import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from '@/store/UserStore';
import { GetMessageByRoomId, GetMessageByRoomIdByPage } from '@/api/message'
export const useMessageStore = defineStore('messages', {
  state: () => ({
    messages: [
    ],
    page: 1,
    size: 10,
    hasMore: true,
  }),
  actions: {

    async fetchMessagesByRoomId(roomId) {
      console.log("loading message")
      
      const messageStore = useMessageStore();
      const userStore = useUserStore();
      messageStore.InitMessage();

      //返回的data格式：
      /*
        Integer messageId;
        Integer roomId;
        Integer userId;
        String content;
        String messageType;
        Timestamp createdAt;
      */
      const { code, message, data } = (await GetMessageByRoomId(roomId)).data
    
      if (code === 200) {
        data.forEach((dataitr) => {
          messageStore.addMessage(dataitr);
          if(userStore.userExists(dataitr.userId) === false) {
            userStore.initUser(dataitr.userId);
          }
        });
        await userStore.updateAllUsersInfo();
      } else {
        console.log("Failed to fetch messages:"+message);
      }
      this.messages.sort((a, b) => a.messageId - b.messageId);
      
    },

    async fetchMessagesByRoomIdByPage(roomId) {
      if (!this.hasMore) return;
      console.log("loading message by page", roomId)
      // const messageStore = useMessageStore();
      const userStore = useUserStore();
      // messageStore.InitMessage();
      const { code, message, data } = (await GetMessageByRoomIdByPage(roomId, this.page, this.size)).data
      // console.log(data)
      
      // this.messages.sort((a, b) => a.messageId - b.messageId);
      if (code === 200) {
        console.log('data.list:', data.list);
        console.log('this.messages:', this.messages);

        this.messages = [...data.list, ...this.messages];
        this.messages.sort((a, b) => a.messageId - b.messageId);
        data.list.forEach((dataitr) => {
          if(userStore.userExists(dataitr.userId) === false) {
            userStore.initUser(dataitr.userId);
          }
        });
        await userStore.updateAllUsersInfo();
        this.page = this.page+1;
        this.hasMore = data.hasNextPage;
      } else {
        console.log("Failed to fetch messages:"+message);
      }
      
      
    },

    async addMessage(newMessage) {
      try {
        const userStore = useUserStore();
        if(!userStore.userExists(newMessage.userId)) {
          console.log("刷新用户信息");
          userStore.initUser(newMessage.userId);
          await userStore.updateAllUsersInfo();
        }
        console.log('Adding new message:', newMessage);
        // Assuming newMessage is an object with the required fields
        this.messages.push(newMessage);
        
      } catch (error) {
        console.error('Failed to add message:', error);
      }
    },

    InitMessage() {
      this.hasMore = true;
      this.messages = [];
      this.page = 1;
      
    },

    OrderMessage() {
      this.messages = this.messages.slice().sort((a, b) => a.messageId - b.messageId);
    }
  }
});
