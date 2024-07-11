<template>
  <div class="user-panel">
    <el-scrollbar ref="refScrollbar">
      <div ref="refInner" class="padding-n-5">
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
import { ref, computed } from 'vue';
import { onMounted } from 'vue';
import UserCard from './user-card/index.vue'

import Mycard from '@/views/pages/test.vue'
const roomStore = useRoomStore()
const active = computed(() => roomStore.currentActive)

const users = computed(() => {
  return roomStore.getRoomById(active.value).onlineUsers;
})





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
