<template>
    <div class="editor  padding-15">
      <div class="tools flex">

      </div>
      <div class="margin_t-10 flex flex_a_i-flex-end">
        <el-input
          ref="refTextarea"
          class="flex-item_f-1"
          v-model="text"
          type="textarea"
          rows="3"
          resize="none"
          placeholder="善语结善缘，恶言伤人心~"
          maxlength="500"
          show-word-limit
          @keydown="textareaListener" />
        <div class="send-wrap">
          <el-icon class="cursor-pointer" size="20"><EpPromotion /></el-icon>
        </div>
      </div>
    </div>
  </template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
const route = useRoute();
const roomId = route.params.roomId;
const loading = ref(false)
const refTextarea = ref()
const text = ref('')

const textareaListener = (e) => {
  if (e.keyCode === 13 && !loading.value) {
    if (!e.shiftKey) {
      textSendHandle()
      e.preventDefault()
      return false
    }
  }
}
</script>

<style scoped>
.editor {
  padding: 10px 15px 10px 15px;
}
.editor .tools {
  color: var(--el-color-info-dark-2);
}
.editor .tools .tool {
  margin-left: 10px;
}
.editor .send-wrap {
  color: var(--el-color-info-dark-2);
}
::v-deep .el-textarea__inner {
  padding: 0;
  box-shadow: none;
  border: none;
}
</style>