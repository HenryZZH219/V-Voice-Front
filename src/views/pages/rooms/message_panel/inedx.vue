<template>

  <div class="message-panel flex flex_d-column">

    <template v-if=true>

      <div class="header flex_a_i-center">
        <span class="margin_l-10">{{ name }}</span>
      </div>
      <el-scrollbar ref="refScrollbar" @scroll="scrollHandle">
        <div ref="refInner" class="flex-item_f-1 padding-15">
          <Loading class="loading" text="消息加载中" v-show="loading"></Loading>
          <div class="message-wrap" v-for="item in messages">
            <Message :message="item" :reverse="false" :key="item.messageId" v-if="loading === false">
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
//:key="item.id"
import Editor from '../editor/index.vue';

import Message from '../messages/index.vue';
import { useMessageStore } from '@/store/MessageStore';
import { MessageSent, MessageReceive } from '@/types/user';
import { onMounted, ref, onUnmounted, reactive, computed, watch, nextTick, onBeforeMount } from 'vue';
import WebSocketManager from '@/service/websocket/websocketManager';
import { useRoute } from 'vue-router';



const name = "聊天"
const loading = ref(true);
const parentLoaded = ref(false);
const messageStore = useMessageStore();
// const messages = messageStore.messages;
const messages = computed(() => messageStore.messages);
//消息获取并获得用户信息
// const newMessage = ref({
//   id: null,  // Assuming you generate id in some way, e.g., a UUID or from the server
//   nickname: '',
//   email: '',
//   text: ''
// });


const messageReceive = ref<MessageReceive[]>([]);
//载入初始数据
// const fetchMessage = async () => {
//   console.log("loading message")

//   const messageStore = useMessageStore();
//   const userStore = useUserStore();
//   messageStore.InitMessage();
const router = useRoute();
const roomId = router.params.roomId;

//   //返回的data格式：
//   /*
//     Integer messageId;
//     Integer roomId;
//     Integer userId;
//     String content;
//     String messageType;
//     Timestamp createdAt;
//   */
//   const { code, message, data } = (await GetMessageByRoomId(roomId)).data

//   if (code === 200) {
//     data.forEach((dataitr) => {
//       messageStore.addMessage(dataitr);
//       if(userStore.userExists(dataitr.userId) === false) {
//         userStore.initUser(dataitr.userId);
//       }
//     });
//     await userStore.updateAllUsersInfo();
//     parentLoaded.value = true;
//   } else {
//     ElMessage.error(message)
//   }
// }

// onBeforeMount(async () => {
//   await fetchMessage()
// });

onMounted(async () => {
  // fetchMessage()
  await useMessageStore().fetchMessagesByRoomId(roomId);
  loading.value = false;

  const websocketManager = WebSocketManager.getInstance();
  const token = localStorage.getItem('token');
  const websocketUrl = `ws://localhost:8501/chat/${roomId}?token=${token}`;
  websocketManager.connect(websocketUrl);
  websocketManager.addMessageHandler(handleMessage);
  websocketManager.addCloseHandler(handleClose);
  websocketManager.addErrorHandler(handleError);
  // const websocketManager = WebSocketManager.getInstance();

});
const handleMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  messageStore.addMessage(data);
};


const handleError = (error: Event) => {
  console.error('WebSocket encountered error: ', error);
};

const handleClose = (event: CloseEvent) => {
  console.log('WebSocket closed: ', event);
};


const scrollTop = ref(0)
const refScrollbar = ref()
const refInner = ref()
/**
 * 滚动条滚动到底部
 */
const scrollToBottom = () => {
  const scrollTop = refInner.value.clientHeight - refScrollbar.value.wrapRef.clientHeight
  refScrollbar.value.setScrollTop(scrollTop)
}

// watch(active, async () => {
//   finished.value = false
//   if (!messages.value.length) {
//     await getData()
//   }
//   nextTick(() => {
//     scrollToBottom()
//   })
// })

watch(messages, () => {
  if (refScrollbar.value) {
    nextTick(() => {
      const difference = refInner.value.clientHeight - refScrollbar.value.wrapRef.clientHeight - refScrollbar.value.wrapRef.scrollTop
      if (difference < refScrollbar.value.wrapRef.clientHeight) {
        scrollToBottom()
      }
    })
  }
}, { deep: true })

const scrollHandle = async (scroll) => {
  scrollTop.value = scroll.scrollTop
  if (scroll.scrollTop < 1) { //&& !loading.value && !finished.value
    console.log("toptoptop")
    // loading.value = true
    // // setTimeout(async () => {
    //   const height = refInner.value.clientHeight
    //   // await getData()
    //   const top = refInner.value.clientHeight - height
    //   scrollTop.value = top
    //   refScrollbar.value.setScrollTop(top)
    // // }, 1000)
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
