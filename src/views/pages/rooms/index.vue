<template>
  <div>
    {{ roomId }}
    <div class="conversation flex">
      <el-scrollbar class="width-280 padding-n-10">
        <ConversationCard></ConversationCard>
      </el-scrollbar>
      <MessagePanel class="flex-item_f-1"></MessagePanel>
      <GroupUserPanel class="margin_l-10 width-200">123</GroupUserPanel>
    </div>
  </div>
</template>


<script setup lang="ts">
import MessagePanel from './message_panel/inedx.vue'
import { useRoute } from 'vue-router';
import { useMessageStore } from '@/store/MessageStore';
import WebSocketManager from '@/service/websocket/websocketManager';
import { onMounted, ref, onUnmounted, reactive, onBeforeMount } from 'vue';

const route = useRoute();
const roomId = route.params.roomId;

//websocket连接

onMounted(async() => {

  // const websocketManager = WebSocketManager.getInstance();
  // const token = localStorage.getItem('token');
  // const websocketUrl = `ws://localhost:8501/chat/${roomId}?token=${token}`;
  // websocketManager.connect(websocketUrl);

  // websocketManager.addCloseHandler(handleClose);
  // websocketManager.addErrorHandler(handleError);


});

onUnmounted(() => {
  WebSocketManager.getInstance().disconnect();
});




</script>

<style scoped>
.editor {
  border-radius: var(--el-border-radius-round);
  border-top: 1px solid var(--wrap-background-color);
}
</style>

<style lang="scss" scoped>
.conversation {
  // height: 400px;
  height: 70vh; /* 设置为视口高度的100% */
  overflow-y: auto; /* 当内容超出时显示滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
  border: 1px solid black; /* 用于调试，确保样式应用 */
}
</style>

