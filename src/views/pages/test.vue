<template>
    <h1>Chat Room: {{ roomId }}</h1>


</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount  } from 'vue'
import { useRoute } from 'vue-router';
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import vHeader from '@/components/header.vue';
// import vSidebar from '@/components/sidebar.vue';
const route = useRoute();
const roomId = route.params.roomId;
const item = {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
}
const tableData = ref(Array.from({ length: 20 }).fill(item))

const containerRef = ref(null);
const itemheight = ref(100)
onMounted(() => {
  resizeContainer();
  window.addEventListener('resize', resizeContainer);
});
onBeforeUnmount(() => {
    window.removeEventListener('resize',resizeContainer);
});
const resizeContainer = () => {
  if (itemheight) {
    itemheight.value = window.innerHeight - 70;
  }
};


</script>

<style scoped>

</style>