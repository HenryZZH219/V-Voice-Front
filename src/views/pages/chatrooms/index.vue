<template>
    <div :key="roomId">
        <div class="conversation flex">
            <div class="width-280 flex_d-column scrollbar margin_r-10">
                <div class="header flex_a_i-center">
                    <span class="margin_l-10">{{ "房间" }}</span>
                </div>
                <el-scrollbar>
                    <ChatroomPanel v-for="item in roomList" :key="item.roomId" :room="item" @reloadPage="reloadPage">
                    </ChatroomPanel>
                </el-scrollbar>
                <div>
                    <sysUserCard class=" sys-user-card" v-if="loading === false"></sysUserCard>
                </div>

            </div>



            <MessagePanel class="flex-item_f-1" v-if="loading === false"></MessagePanel>
            <GroupUserPanel class="margin_l-10 width-200" v-if="loading === false"></GroupUserPanel>
        </div>
    </div>
</template>


<script setup lang="ts">
import MessagePanel from './message_panel/index.vue'
import ChatroomPanel from './chatroom_panel/index.vue'
import GroupUserPanel from './user-panel/index.vue'
import { ref, computed, onMounted } from 'vue';
import { useRoomStore } from '@/store/RoomStore';
import { useMessageStore } from '@/store/MessageStore';
import sysUserCard from './sysUserCard/index.vue'

const RoomStore = useRoomStore();
const roomList = computed(() => RoomStore.rooms)
const roomId = computed(() => RoomStore.currentActive);
const loading = ref(true);

onMounted(async () => {
    await reloadPage();
})

const reloadPage = async () => {
    loading.value = true;
    await RoomStore.fetchRooms();
    useMessageStore().InitMessage();
    await useMessageStore().fetchMessagesByRoomIdByPage(roomId.value);
    loading.value = false;
}




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
    height: 80vh;
    /* 设置为视口高度的100% */
    overflow-y: auto;
    /* 当内容超出时显示滚动条 */
    overflow-x: hidden;
    /* 隐藏水平滚动条 */
    //border: 1px solid black;
    /* 用于调试，确保样式应用 */
    // 
}

.scrollbar {

    background-color: var(--card-background-color);
    border-radius: var(--box-border-radius);
}

.sys-user-card {
    
    border: 0px solid black;
    border-top: 1px solid var(--wrap-background-color);
    height: 80px;
}

.header {
    padding: 10px 15px;
    border-bottom: 1px solid var(--wrap-background-color);

    //   transform: translate(-50%, -50%);
    color: var(--el-color-info-light-5);
    ;
    /* 设置文字颜色 */
    font-size: 20px;
    /* 设置文字大小 */
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);

}
</style>