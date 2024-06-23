<template>
  <div>
    {{roomId}}
    <Editor class="flex-item_f-1"></Editor>

  </div>
</template>


<script setup lang="ts">
import Editor from './editor/index.vue'
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
const route = useRoute();
const roomId = route.params.roomId;
</script>