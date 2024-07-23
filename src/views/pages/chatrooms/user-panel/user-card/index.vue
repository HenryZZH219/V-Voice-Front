<template>

    <!-- <el-avatar :src="userStore.getUserById(userId).avatar" :alt="userStore.getUserById(userId).name" :size="30"
            slice-length="2"></el-avatar> -->
    <div v-if="user" class="cursor-pointer flex flex_a_i-center">
        <audio :ref="audio" autoplay></audio>
        <el-avatar class="user-avatar" :size="30" slice-length="2">
            <template v-if="user.avatar">
                <img :src="user.avatar" alt="avatar">
            </template>
            <template v-else>
                {{ user.name }}
            </template>
        </el-avatar>
        <div class="flex-item_f-1 font-size-12 margin_l-10 ellipse">{{ user.name }}
        </div>
    </div>

</template>


<script setup lang="ts">
import { useUserStore } from '@/store/UserStore';
import { onMounted, ref } from 'vue';
import { useWebRTCStore } from '@/store/webRTCStore';
const userStore = useUserStore();
const webRTCStore = useWebRTCStore();
const props = defineProps({
    userId: {
        type: Number,
        default: () => 2,
    },
})
const user = ref();
const audio = ref(null);
onMounted(async () => {
    console.log("user-card-")
    if (userStore.userExists(props.userId)) {
        user.value = userStore.getUserById(props.userId)
    }
    else {
        userStore.initUser(props.userId);
        await userStore.updateAllUsersInfo();
        user.value = userStore.getUserById(props.userId)
    }

    webRTCStore.setRemoteAudio({userId: props.userId, audioElement:audio });
    
})
</script>
