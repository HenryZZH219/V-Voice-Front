<template>
  <div class="message flex" :class="reverse ? 'reverse' : ''">
    <!-- <el-avatar :src="user.avatar" :alt="user.name" :size="40" @click="avatarClickHandle"></el-avatar> -->
    <el-avatar class="user-avatar" :size="40">
      <template v-if="user.avatar">
        <img :src="user.avatar" alt="avatar">
      </template>
      <template v-else>
        {{ user.name }}
      </template>
    </el-avatar>
    <div class="wrap flex-item_f-1 margin-n-10 flex_d-column flex_a_i-flex-start">
      <div class="info margin_b-6 flex">
        <span>{{ user.name }}</span>
        <span class="email" v-if="user.email">({{ user.email }})</span>
        <span class="time margin-n-10" v-if="date">{{ formattedDateTime }}</span>
      </div>
      <TextMessage :text="message.content"></TextMessage>
    </div>
  </div>
</template>

<script setup>
import TextMessage from './text-message/index.vue'
import { useUserStore } from '@/store/UserStore';
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

const userStore = useUserStore();
const user = userStore.getUserById(props.message.userId);
// const date = new Date(props.message.createdAt);

const date = new Date(props.message.createdAt);
const formattedDate = date.toLocaleDateString('zh-HK', { year: 'numeric', month: 'short', day: 'numeric' });
const formattedTime = date.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' });
const formattedDateTime = `${formattedDate} ${formattedTime}`;

</script>

<style lang="scss" scoped>
.message {
  
  .avatar {
    flex-shrink: 0;
  }

  .info {
    font-size: 12px;
    color: var(--el-color-info-dark-2);

    .email,
    .time {
      display: none;
    }
  }

  &:hover .email,
  &:hover .time {
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

.user-avatar {
  border: 1px solid #fff;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 7px 12px 0 rgba(62, 57, 107, 0.16);

  /* 文字样式 */
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  /* 将文字转为大写 */
  background-color: #409EFF;
  /* 默认的背景颜色，可以根据需要调整 */
}
</style>