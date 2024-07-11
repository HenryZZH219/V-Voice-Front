<template>
  <div :key="RoomStore.currentActive">
    {{ roomId }}
    <div class="conversation flex">
      <el-scrollbar class="width-280 padding-n-10">
        <ChatroomPanel v-for="item in roomList" :key="item.roomId" :room="item"></ChatroomPanel>
      </el-scrollbar>
      <MessagePanel class="flex-item_f-1" v-if="loading === false"></MessagePanel>
      <GroupUserPanel class="margin_l-10 width-200" v-if="loading === false"></GroupUserPanel>
    </div>
  </div>
</template>


<script setup lang="ts">
import MessagePanel from './message_panel/index.vue'
import ChatroomPanel from './chatroom_panel/index.vue'
import GroupUserPanel from './user-panel/index.vue'
import { useRoute } from 'vue-router';
import {ref, computed, onMounted} from 'vue';
import { useRoomStore } from '@/store/RoomStore';
import { useRouter } from 'vue-router';
import { useMessageStore } from '@/store/MessageStore';
const route = useRoute();
const roomId = computed(() => route.params.roomId);
const RoomStore = useRoomStore();
const roomList = computed(() => RoomStore.rooms)
const router = useRouter();
if(RoomStore.currentActive!==Number(roomId.value)){
  router.push(`/chats/${RoomStore.currentActive}`);
}

const loading = ref(true);
onMounted(async () => {
  await RoomStore.fetchRooms();
  useMessageStore().InitMessage();
  await useMessageStore().fetchMessagesByRoomIdByPage(RoomStore.currentActive);
  loading.value = false;
  
} ) 


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
  // border: 1px solid black; /* 用于调试，确保样式应用 */
}
</style>

