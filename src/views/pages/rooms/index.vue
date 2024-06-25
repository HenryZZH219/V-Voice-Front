<template>
  <div>
    {{ roomId }}
    <div class="conversation flex">
      <el-scrollbar class="width-280 padding-n-10">
        <ConversationCard></ConversationCard>
      </el-scrollbar>
      <MessagePanel class="flex-item_f-1">123</MessagePanel>
      <GroupUserPanel class="margin_l-10 width-200">123</GroupUserPanel>
    </div>
  </div>
</template>


<script setup lang="ts">
import MessagePanel from './message_panel/inedx.vue'
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
const route = useRoute();
const roomId = route.params.roomId;
</script>

<style scoped>
.editor {
  border-radius: var(--el-border-radius-round);
  border-top: 1px solid var(--wrap-background-color);
}
</style>
