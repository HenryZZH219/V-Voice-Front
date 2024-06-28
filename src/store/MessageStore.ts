import { defineStore } from 'pinia';
import axios from 'axios';
import { useUserStore } from '@/store/UserStore';
import { GetMessageByRoomId } from '@/api/message'
export const useMessageStore = defineStore('messages', {
  state: () => ({
    messages: [
      // { id: 1, nickname: 'John', email: 'john@example.com', text: 'Hello!' },
      // { id: 2, nickname: 'Alice', email: 'alice@example.com', text: 'Hi there!' },
      // { id: 3, nickname: 'Bob', email: 'bob@example.com', text: 'Hey!' },
      // { id: 4, nickname: 'Jan', email: 'Jan@example.com', text: 'Hey~!' }
    ]
  }),
  actions: {
    async fetchMessages() {
      try {
        const response = await axios.get('https://api.example.com/messages'); // 替换为你的后端API
        this.messages = [...this.messages, ...response.data];
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    },

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
    },

    addMessage(newMessage) {
      try {
        // console.log('Adding new message:', newMessage);
        // Assuming newMessage is an object with the required fields
        this.messages.push(newMessage);
      } catch (error) {
        console.error('Failed to add message:', error);
      }
    },

    InitMessage() {
      this.messages = [];
    }
  }
});
