<template>

    <!-- <el-avatar :src="userStore.getUserById(userId).avatar" :alt="userStore.getUserById(userId).name" :size="30"
            slice-length="2"></el-avatar> -->
    <div v-if="user" class="cursor-pointer flex_a_i-center" @click="toggleIcon">
        <el-avatar class="user-avatar" :size="30" slice-length="2">
            <template v-if="user.avatar">
                <img :src="user.avatar" alt="avatar">
            </template>
            <template v-else>
                {{ user.name }}
            </template>
        </el-avatar>
        <div class="flex-item_f-1 font-size-14 margin_l-10 margin_r-10 ellipse">{{ user.name }}
        </div>

        <el-icon v-if="isMicrophoneVisible" :style="{ color: isConnectionActive ? 'green' : 'red' }">
            <Microphone />
        </el-icon>
        <el-icon v-else :style="{ color: isConnectionActive ? 'green' : 'red' }">
            <Mute />
        </el-icon>

    </div>

    <div>
        <el-dialog v-model="dialogVisible"  title="音量控制" width="30%" #header="{titleId}">
            <div :id="titleId" class="whitefont  margin_b-15">音量控制</div>
            <el-slider class = "margin_b-15" v-model="volume" :min="0" :max="1" :step="0.01" show-input></el-slider>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleVolumeChange">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script setup lang="ts">
import { useUserStore } from '@/store/UserStore';
import { onMounted, ref, computed, watch } from 'vue';
import { useWebRTCStore } from '@/store/webRTCStore';
import { fa } from 'element-plus/es/locale';
const userStore = useUserStore();
const webRTCStore = useWebRTCStore();
const props = defineProps({
    userId: {
        type: Number,
        default: () => 2,
    },
})
//设置输入音频
const dialogVisible = ref(false);
const user = ref();
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


})

const isMicrophoneVisible = ref(true);
const toggleIcon = () => {
    // isMicrophoneVisible.value = !isMicrophoneVisible.value;
    // if(isConnectionActive.value == true)
    dialogVisible.value = true;
}

const isConnectionActive = computed(() => {
    const peerConnection = webRTCStore.getPeerConnection(props.userId);
    return peerConnection && webRTCStore.getConnectionState(props.userId) === 'connected';
})

//调整音量
const volume = ref(0.5); // 默认音量为1

const handleVolumeChange = (value) => {
    if (isConnectionActive.value == true) {
        webRTCStore.setGain(props.userId, (volume.value));

    }
    dialogVisible.value = false;

};
</script>

<style lang="scss" scoped>
.mic {

    flex-direction: row-reverse;
}

.whitefont {
    //   transform: translate(-50%, -50%);
    color: var(--el-color-info-light-5);
    /* 设置文字颜色 */
    font-size: 20px;
    /* 设置文字大小 */
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}
</style>