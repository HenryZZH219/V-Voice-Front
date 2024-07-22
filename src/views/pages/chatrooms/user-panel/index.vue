<template>
  <div class="user-panel">
    <el-scrollbar ref="refScrollbar">
      <div ref="refInner" class="padding-n-5">
        <el-button @click="callUser"></el-button>
        <el-button @click="show"></el-button>
        <div class="wrap padding-5 cursor-pointer flex flex_a_i-center" v-for="userId in users" :key="userId">
          <!-- @click="clickHandle(userId)" -->
          <UserCard :userId="userId"></UserCard>

        </div>
      </div>
    </el-scrollbar>
    <!-- <ApplyFriendDialog ref="refApplyFriendDialog"></ApplyFriendDialog> -->
  </div>
</template>

<script lang="ts" setup>
import { useRoomStore } from '@/store/RoomStore';
import { useWebRTCStore } from '@/store/webRTCStore';
import { ref, computed, onMounted } from 'vue';

import UserCard from './user-card/index.vue'

const roomStore = useRoomStore()
const active = computed(() => roomStore.currentActive)

const users = computed(() => {
  return roomStore.getRoomById(active.value).onlineUsers;
})

// const userId = JSON.parse(localStorage.getItem('user')).id;
const webRTCStore = useWebRTCStore();

// onMounted(() => {
//   // 初始化所有用户的连接
//   webRTCStore.initializeConnections(users.value);


// });
const callUser = () => {
  webRTCStore.createAndSendOffer(webRTCStore.currentUserId);
  users.value.forEach(userId => {
    if (userId !== webRTCStore.currentUserId) {
      webRTCStore.createAndSendOffer(userId);
    }
  });
};

const show = () => {
  const peerConnections = webRTCStore.peerConnections;
  for (const key in peerConnections) {
  if (peerConnections.hasOwnProperty(key)) {
    const value = peerConnections[key];
    console.log(`Key: ${key}, Value:`, value);
  }
}
};

</script>

<style lang="scss" scoped>
.user-panel {
  background-color: var(--card-background-color);
  border-radius: var(--box-border-radius);

  .wrap {
    border-radius: var(--box-border-radius);
    color: var(--el-color-info-dark-2);

    &:hover {
      background-color: var(--card-hover-background-color);
    }

    &:first-child {
      margin-top: 10px;
    }
  }
}
</style>
