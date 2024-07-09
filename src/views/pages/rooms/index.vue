<template>
  <div>
    {{ roomId }}
    <div class="conversation flex">
      <el-scrollbar class="width-280 padding-n-10">
        <ChatroomPanel v-for="item in roomList" :key="item.roomId" :room="item"></ChatroomPanel>
      </el-scrollbar>
      <MessagePanel class="flex-item_f-1"></MessagePanel>
      <GroupUserPanel class="margin_l-10 width-200">123</GroupUserPanel>
    </div>
  </div>
</template>


<script setup lang="ts">
import MessagePanel from './message_panel/index.vue'
import ChatroomPanel from './chatroom_panel/index.vue'
import { useRoute } from 'vue-router';
import WebSocketManager from '@/service/websocket/websocketManager';
import {onUnmounted, computed} from 'vue';
import { useRoomStore } from '@/store/RoomStore';
const route = useRoute();
const roomId = route.params.roomId;
const RoomStore = useRoomStore();
const roomList = computed(() => RoomStore.rooms)
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
  height:80vh; /* 设置为视口高度的100% */
  overflow-y: auto; /* 当内容超出时显示滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
  border: 1px solid black; /* 用于调试，确保样式应用 */
}
</style>

