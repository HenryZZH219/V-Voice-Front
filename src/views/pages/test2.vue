<template>
  <div class="editor  padding-15">
    <div class="tools flex">

    </div>
    <div class="margin_t-10 flex flex_a_i-flex-end">
      <el-input ref="refTextarea" class="flex-item_f-1" v-model="messageSent.content" type="textarea" rows="3" resize="none"
        placeholder="善语结善缘，恶言伤人心~" maxlength="500" show-word-limit @keydown="textareaListener" />
      <div class="send-wrap">
        <el-icon class="cursor-pointer" size="20" @click="textSendHandle">
          <Promotion />
        </el-icon>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref, onUnmounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import { createWebSocket } from '@/service/websocketFactory';
import { MessageSent, MessageReceive } from '@/types/user';
const route = useRoute();
const roomId = route.params.roomId;
const loading = ref(false)
const refTextarea = ref()


let socket: WebSocket | null = null;
const messageSent = reactive<MessageSent>({
    token:localStorage.getItem('token'),
    content: '',
    messageType: 'TEXT'
});
const messageReceive = ref<MessageReceive[]>([]);

const handleMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  messageReceive.value.push({
    userID: data.userID,
    content: data.content,
    messageType: data.messageType,
    createdAt: data.createdAt,
  });
  console.log(data)
};

const handleError = (error: Event) => {
  console.error('WebSocket encountered error: ', error);
};

const handleClose = (event: CloseEvent) => {
  console.log('WebSocket closed: ', event);
};


onMounted(() => {
  const websocketUrl = 'ws://localhost:8501/chat/1';
  socket = createWebSocket(websocketUrl, handleMessage, handleError, handleClose);
});

onUnmounted(() => {
  if (socket) {
    // socket.removeEventListener('message', handleMessage);
    socket.close();
  }
});

const sendMessage = () => {
      if (socket) {
        const json = JSON.stringify(messageSent); 
        socket.send(json);
        console.log('WebSocket message sent:', json);
      }
    };

const textSendHandle = () => {
  console.log(messageSent)
  sendMessage()
}
const textareaListener = (e) => {
  if (e.keyCode === 13 && !loading.value) {
    if (!e.shiftKey) {
      textSendHandle()
      e.preventDefault()
      return false
    }
  }
}
</script>

<style scoped>
.editor {
  padding: 10px 15px 10px 15px;
}

.editor .tools {
  color: var(--el-color-info-dark-2);
}

.editor .tools .tool {
  margin-left: 10px;
}

.editor .send-wrap {
  color: var(--el-color-info-dark-2);
}

:v-deep .el-textarea__inner {
  padding: 0;
  box-shadow: none;
  border: none;
}
</style>