<template>
    
    <div class="message-panel flex flex_d-column">
        
        <template>
            
            <div class="header flex_a_i-center">
                <span class="margin_l-10">{{ name }}</span>
            </div>
            <el-scrollbar ref="refScrollbar">
                <div ref="refInner" class="flex-item_f-1 padding-15">
                </div>
            </el-scrollbar>
            
        </template>
        <Editor class="editor"></Editor>
        <ApplyFriendDialog ref="refApplyFriendDialog"></ApplyFriendDialog>
    </div>
</template>

<script setup lang="ts">

import Editor from '../editor/index.vue'


const name = "聊天"
const loading = false;
</script>


<style lang="scss" scoped>
.message-panel {
  background-color: var(--card-background-color);
  border-radius: var(--box-border-radius);
  .header {
    padding: 10px 15px;
    border-bottom: 1px solid var(--wrap-background-color);
  }
  .message-wrap + .message-wrap {
    margin-top: 20px;
  }
  .editor {
    border-radius: var(--el-border-radius-round);
    border-top: 1px solid var(--wrap-background-color);
  }
}
</style>
