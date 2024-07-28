<template>

    <el-card @click="showAudioDevicesDialog" class="card">
        <div v-if="user" class="cursor-pointer flex flex_a_i-center">
            <el-avatar class="user-avatar" :size="40" slice-length="2">
                <template v-if="user.avatar">
                    <img :src="user.avatar" alt="avatar">
                </template>
                <template v-else>
                    {{ user.name }}
                </template>
            </el-avatar>
            <div class="flex-item_f-1 font-size-20 margin_l-10 ellipse whitefont">{{ user.name }}
            </div>

            <el-icon class="whitefont"><Tools /></el-icon>
        </div>
    </el-card>


    <el-dialog v-model="dialogVisible" title="设置" #header="{titleId}">
        
        <div :id="titleId" class="whitefont  margin_b-15">设置</div>
        <el-select v-model="selectedDevice" placeholder="请选择音频设备">
            <el-option v-for="device in audioInputDevices" :key="device.deviceId" :label="device.label"
                :value="device.deviceId"></el-option>
        </el-select>
        <div class=" margin_t-20">
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmSelection">确认</el-button>
        </span>
        </div>

    </el-dialog>


</template>


<script setup lang="ts">
import { useUserStore } from '@/store/UserStore';
import { onMounted, ref } from 'vue';
import { useWebRTCStore } from '@/store/webRTCStore';
const userStore = useUserStore();
const webRTCStore = useWebRTCStore();
const userId = JSON.parse(localStorage.getItem('user')).id;
const user = ref();
onMounted(async () => {
    console.log("user-card-")
    if (userStore.userExists(userId)) {
        user.value = userStore.getUserById(userId)
    }
    else {
        userStore.initUser(userId);
        await userStore.updateAllUsersInfo();
        user.value = userStore.getUserById(userId)
    }

})



const dialogVisible = ref(false);
const audioInputDevices = ref(null);
const selectedDevice = ref(null);
const showAudioDevicesDialog = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        audioInputDevices.value = devices.filter(device => device.kind === 'audioinput');
        dialogVisible.value = true;
        console.error("Success");
    } catch (error) {
        console.error("Error fetching audio devices: ", error);
    }
};
const confirmSelection = () => {
    // console.log(selectedDevice.value);
    useWebRTCStore().setDeviceId(selectedDevice.value);
    dialogVisible.value = false;
};



</script>

<style lang="scss" scoped>
.card {
    // background-color: var(--card-background-color);
    background: var(--card-background-color);

    position: relative;
    overflow: hidden;
    // height: 50px;
    /* 根据需要调整高度 */
    width: 100%;
    // cursor: pointer;
    border-radius: var(--box-border-radius);
}
.whitefont{

    color: var(--el-color-info-light-5);
    /* 设置文字颜色 */
    font-size: 20px;
    /* 设置文字大小 */
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}
</style>
