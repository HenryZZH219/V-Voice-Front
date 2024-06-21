<template>
    <div class="message-panel flex flex_d-column">
        <template>
            <div class="header flex_a_i-center">
                <!-- <Avatar :src="avatar" :name="name" :size="36"></Avatar> -->
                <span class="margin_l-10">{{ name }}</span>
            </div>
            <el-scrollbar ref="refScrollbar" @scroll="scrollHandle">
                <div ref="refInner" class="flex-item_f-1 padding-15">
                    <Loading class="loading" text="消息加载中" v-show="loading"></Loading>
                    <div class="message-wrap" v-for="item in messages" :key="item.id">
                        <Message :message="item" :reverse="item.userId === userId"
                            @avatar-click="avatarClickHandle(item)"></Message>
                    </div>
                </div>
            </el-scrollbar>
            <Editor class="editor"></Editor>
        </template>
        <ApplyFriendDialog ref="refApplyFriendDialog"></ApplyFriendDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
const name = ref('test')


</script>