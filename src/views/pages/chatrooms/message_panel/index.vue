<template>

  <div class="message-panel flex flex_d-column">

    <template v-if=true>

      <div class="header flex_a_i-center">
        <span class="margin_l-10">{{ name }}</span>
      </div>
      <el-scrollbar ref="refScrollbar"  :always="true" @scroll="scrollHandle">
        <div ref="refInner" class="flex-item_f-1 padding-15">
          <div class="message-wrap" v-for="item in messages" :key="item.messageId">
            <Message :message="item" :reverse="item.userId === userId" :key="item.messageId" v-if="loading === false">
            </Message>
          </div>
        </div>
      </el-scrollbar>

    </template>
    <Editor class="editor"></Editor>
    <ApplyFriendDialog ref="refApplyFriendDialog"></ApplyFriendDialog>
  </div>
</template>

<script setup lang="ts">

import Editor from '../editor/index.vue';
import Message from '../messages/index.vue';
import { useMessageStore } from '@/store/MessageStore';
import { MessageSent, MessageReceive } from '@/types/user';
import { onMounted, ref, onUnmounted, reactive, computed, watch, nextTick, onBeforeMount } from 'vue';
import WebSocketManager from '@/service/websocket/websocketManager';
import { useRoomStore } from '@/store/RoomStore';
import { useWebRTCStore } from '@/store/webRTCStore';

const name = "聊天"
const loading = ref(true);
const messageStore = useMessageStore();
const messages = computed(() => {
  return messageStore.messages
});
const userId = JSON.parse(localStorage.getItem('user')).id;
const roomId = computed(() => useRoomStore().currentActive);

onUnmounted(() => {
  WebSocketManager.getInstance().disconnect();
});


onMounted(async () => {
  console.log("messagepanel")
  loading.value = false;

  const websocketManager = WebSocketManager.getInstance();
  const token = localStorage.getItem('token');
  const websocketUrl = `ws://localhost:8501/chat/${roomId.value}?token=${token}`;
  await websocketManager.connect(websocketUrl);
  websocketManager.addMessageHandler(handleMessage);
  websocketManager.addCloseHandler(handleClose);
  websocketManager.addErrorHandler(handleError);

  nextTick(() => {
    scrollToBottom()
  })
});
const handleMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  if (data.messageType === "PING_PONG") {
    if (data.content === "ping") {
      const websocketManager = WebSocketManager.getInstance();
      const messageSent = reactive<MessageSent>({
        content: 'pong',
        messageType: 'PING_PONG'
      });
      websocketManager.sendMessage(messageSent);
      console.log("pong")
    }

  }else if(data.messageType === "SysMsg"){
    useRoomStore().fetchRooms();
    messageStore.addMessage(data);
  }else if(data.messageType === "RTCMsg"){
    useWebRTCStore().handleSignalMessage(data.content);
    console.log("data.RTCMsg:", data.content)
  }else {
    messageStore.addMessage(data);
  }

};


const handleError = (error: Event) => {
  console.error('WebSocket encountered error: ', error);
};

const handleClose = (event: CloseEvent) => {
  console.log('WebSocket closed: ', event);
};

const refScrollbar = ref()
const refInner = ref()
/**
 * 滚动条滚动到底部
 */
const scrollToBottom = () => {
  const scrollTop = refInner.value.clientHeight - refScrollbar.value.wrapRef.clientHeight
  refScrollbar.value.setScrollTop(scrollTop)
}

watch(messages, () => {
  if (refScrollbar.value) {
    // console.log("消息更新")
    nextTick(() => {
      const difference = refInner.value.clientHeight - refScrollbar.value.wrapRef.clientHeight - refScrollbar.value.wrapRef.scrollTop
      // console.log(difference, refScrollbar.value.wrapRef.clientHeight)
      if (difference < refScrollbar.value.wrapRef.clientHeight) {
        scrollToBottom()
      }
    })

  }
}, { deep: true })

const scrollHandle = async (scroll) => {
  console.log("top", scroll.scrollTop)
  // console.log(roomId.value)
  // scrollTop.value = scroll.scrollTop
  if (scroll.scrollTop < 1 && !loading.value) { //&& !loading.value && !finished.value
    const scrollHeight = refInner.value.clientHeight;
    loading.value = true;
    await useMessageStore().fetchMessagesByRoomIdByPage(roomId.value);
    loading.value = false;
    nextTick(() => {
      const newHeight = refInner.value.clientHeight;
      refScrollbar.value.setScrollTop(newHeight - scrollHeight)
    })


  }

}

</script>

<style lang="scss" scoped>
.message-panel {
  background-color: var(--card-background-color);
  border-radius: var(--box-border-radius);

  .header {
    padding: 10px 15px;
    border-bottom: 1px solid var(--wrap-background-color);
  }

  .message-wrap+.message-wrap {
    margin-top: 20px;
  }

  .editor {
    border-radius: var(--el-border-radius-round);
    border-top: 1px solid var(--wrap-background-color);
  }
}
</style>
