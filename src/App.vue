<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { useThemeStore } from './store/theme';

const theme = useThemeStore();
theme.initTheme();
</script>
<style>
@import './assets/css/main.css';
</style>

<style>
#app {
	height: 100vh;
	width: 100%;
	/* display: flex; */
	font-size: var(--el-font-size-base);
	color: var(--el-text-color-primary);
	overflow-y: auto;
	/* 当内容超出时显示滚动条 */
	overflow-x: hidden;
	/* 隐藏水平滚动条 */
}
</style>
