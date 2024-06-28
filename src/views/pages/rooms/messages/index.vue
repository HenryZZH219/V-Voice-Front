<template>
    <div class="message flex" :class="reverse ? 'reverse' : ''">
      <!-- <Avatar :src="message.avatar" :name="message.nickname" :size="40" @click="avatarClickHandle"></Avatar> -->
      <div class="wrap flex-item_f-1 margin-n-10 flex_d-column flex_a_i-flex-start">
        <div class="info margin_b-6 flex">
          <span>{{ user.name }}</span>
          <span class="email" v-if="user.email">({{ user.email }})</span>
          <!-- <span class="time margin-n-10">{{ time }}</span> -->
        </div>
        <TextMessage :text="message.content"></TextMessage>
      </div>
    </div>
</template> 
  
<script setup>
  import TextMessage from './text-message/index.vue'
  import { useMessageStore } from '@/store/MessageStore';
  import { useUserStore } from '@/store/UserStore';
  import { onMounted, ref, onUnmounted, reactive, computed, watch, nextTick } from 'vue';
//   import { dateFormat } from '@/utils/index' 
  
  
//   const emits = defineEmits(['avatar-click'])
  
  const props = defineProps({
    message: {
      type: Object,
      required: true,
    },
    reverse: {
      type: Boolean,
      default: () => false
    }
  })
  // = computed(() => messageStore.messages);
  const userStore = useUserStore();
  // console.log(props.message);
  const user = userStore.getUserById(props.message.userId);
  // console.log("user "+props.message.userId+" "+user);
  // 使用 computed 依赖 props.message.userId
// const userId = computed(() => props.message.userId);

// // 监控 userId 的变化，并在变化时获取 user 数据
// watch(userId, (newUserId) => {
//   if (newUserId) {
//     user.value = userStore.getUserById(newUserId);
//     console.log("user " + newUserId + " " + user.value);
//   }
// }, { immediate: true }); // immediate 确保初始化时也会触发一次
//   const time = computed(() => {
//     return dateFormat(props.message.createdAt)
//   })
  
//   const avatarClickHandle = () => {
//     emits('avatar-click', props.message)
//   }
</script>
  
<style lang="scss" scoped>
  .message {
    .avatar {
      flex-shrink: 0;
    }
    .info {
      font-size: 12px;
      color: var(--el-color-info-dark-2);
      .email, .time {
        display: none;
      }
    }
    &:hover .email, &:hover .time {
      display: inline;
    }
  }
  .message.reverse {
    flex-direction: row-reverse;
    .wrap {
      align-items: flex-end;
    }
    .info {
      flex-direction: row-reverse;
    }
  }
</style>
  