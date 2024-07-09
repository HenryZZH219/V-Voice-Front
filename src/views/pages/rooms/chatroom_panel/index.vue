<template>
    <el-card :class="{'active-room': room.roomId === activeId, 'inactive-room': room.roomId !== activeId}" shadow="hover" @click="clickHandle ">
        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            alt="Room Avatar" class="room-avatar-background" />
        <div class="room-name-overlay">
            {{ room.roomName }}
        </div>
    </el-card>
</template>

<script setup>

const props = defineProps({
    room: {
        type: Object,
        required: true,
    },
})

const activeId = 1

//   const active = computed({
//     get: () => conversationStore.active || {},
//     set: (value) => conversationStore.setActive(value)
//   })
const clickHandle = () => {
    console.log("click")
}
</script>

<style lang="scss" scoped>
// .room-card {
//     ::v-deep(.el-badge__content.is-fixed) {
//         right: calc(100% - 40px - var(--el-badge-size));
//         transform: translateY(20%)
//     }

//     &+& {
//         margin-top: 4px;
//     }

// }

.active-room {
    // background-color: var(--card-background-color);
    background: linear-gradient(to right, rgb(140, 218, 140) 3%,  var(--card-background-color) 30%);

    position: relative;
    overflow: hidden;
    height: 50px;
    /* 根据需要调整高度 */
    width: 100%;
}
.inactive-room {
    // background-color: var(--card-background-color);
    background: var(--card-background-color);

    position: relative;
    overflow: hidden;
    height: 50px;
    /* 根据需要调整高度 */
    width: 100%;
    cursor: pointer;
}

// .left-section {
//   width: 30%;
//   background-color: green;
// }

.room-avatar-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.room-avatar-background {
    position: absolute;
    top: 0;
    left: 3%;
    width: 25%;
    height: 100%;
    object-fit: cover;
    /* 确保图片覆盖整个容器 */
    opacity: 0.9;
    /* 设置不透明度 */
}

.room-name-overlay {
    position: absolute;
    top: 25%;
    left: 32%;
    right: 20%;
    //   transform: translate(-50%, -50%);
    color: var(--el-color-info-light-5);
    ;
    /* 设置文字颜色 */
    font-size: 20px;
    /* 设置文字大小 */
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    /* 添加文字阴影以提高可读性 */
}

// .room-avatar {
//     border: 1px solid #fff;
//     border-radius: 50%;
//     overflow: hidden;
//     box-shadow: 0 7px 12px 0 rgba(62, 57, 107, 0.16);

//     /* 文字样式 */
//     font-size: 16px;
//     font-weight: bold;
//     text-transform: uppercase;
//     /* 将文字转为大写 */
//     background-color: #409EFF;
//     /* 默认的背景颜色，可以根据需要调整 */
// }</style>