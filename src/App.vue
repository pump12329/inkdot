<template>
  <div id="app" class="app-layout">
    <!-- 应用头部 -->
    <header class="app-header">
      <div class="container flex items-center justify-between">
        <h1 class="text-xl font-semibold text-primary">InkDot</h1>
        <div class="flex items-center gap-2">
          <span class="text-base font-medium text-primary">思维导图工具</span>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="app-main">
      <!-- 悬浮工具栏 -->
      <div class="floating-toolbar">
        <div class="toolbar-group">
          <button
            type="button"
            class="btn btn-ghost btn-icon"
            title="新建项目 (Ctrl+N)"
            @click="handleNewProject"
          >
            <Plus class="w-4 h-4" />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-icon"
            title="保存项目 (Ctrl+S)"
            @click="handleSaveProject"
          >
            <Save class="w-4 h-4" />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-icon"
            title="打开项目 (Ctrl+O)"
            @click="handleLoadProject"
          >
            <FolderOpen class="w-4 h-4" />
          </button>
        </div>

        <div class="toolbar-group">
          <button
            type="button"
            class="btn btn-ghost btn-icon"
            title="删除节点 (Delete)"
            @click="handleDeleteNode"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="toolbar-group">
          <button
            type="button"
            class="btn btn-ghost btn-icon"
            title="缩小 (Ctrl+-)"
            @click="handleZoomOut"
          >
            <ZoomOut class="w-4 h-4" />
          </button>
          <span class="px-2 text-sm text-secondary">{{ zoomLevel }}%</span>
          <button
            type="button"
            class="btn btn-ghost btn-icon"
            title="放大 (Ctrl+=)"
            @click="handleZoomIn"
          >
            <ZoomIn class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- 思维导图画布区域 -->
      <div class="main-content-inner">
        <div class="mindmap-canvas-container">
          <div class="flex items-center justify-center h-full">
            <div class="text-center">
              <h2 class="text-lg font-medium text-primary mb-4">InkDot 思维导图</h2>
              <p class="text-sm text-secondary mb-6">基于新CSS样式系统的现代化思维导图工具</p>
              <div class="flex gap-3 justify-center">
                <button class="btn btn-primary btn-sm" @click="createSampleNode">
                  创建示例节点
                </button>
                <button class="btn btn-secondary btn-sm" @click="toggleGrid">
                  {{ showGrid ? '隐藏' : '显示' }}网格
                </button>
              </div>
            </div>
          </div>

          <!-- 网格背景 -->
          <div v-if="showGrid" class="grid-background" />

          <!-- 示例节点 -->
          <div
            v-if="sampleNode"
            class="mindmap-node mindmap-node--primary"
            :style="sampleNodeStyle"
          >
            <div class="node-content">{{ sampleNode.content }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <aside v-show="showPanel" class="side-panel">
        <div class="panel-header">
          <div class="panel-tabs">
            <button class="panel-tab active">样式展示</button>
          </div>
        </div>
        <div class="panel-content">
          <div class="panel-pane active">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-primary mb-2">按钮样式</h3>
                <div class="flex flex-col gap-2">
                  <button class="btn btn-primary btn-sm">主要按钮</button>
                  <button class="btn btn-secondary btn-sm">次要按钮</button>
                  <button class="btn btn-ghost btn-sm">幽灵按钮</button>
                  <button class="btn btn-danger btn-sm">危险按钮</button>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-medium text-primary mb-2">输入框样式</h3>
                <input class="input w-full" placeholder="输入框示例" />
              </div>

              <div>
                <h3 class="text-sm font-medium text-primary mb-2">文本样式</h3>
                <p class="text-xs text-secondary">超小文本</p>
                <p class="text-sm text-secondary">小文本</p>
                <p class="text-base text-primary">基础文本</p>
                <p class="text-lg font-medium text-primary">大文本</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <!-- 状态栏 -->
    <footer class="app-footer">
      <span class="text-xs text-secondary">就绪 - InkDot v1.0.0 | 使用新的CSS样式系统</span>
      <button
        class="text-xs text-secondary hover:text-primary transition-colors"
        @click="togglePanel"
      >
        {{ showPanel ? '隐藏' : '显示' }}样式面板
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { FolderOpen, Plus, Save, Trash2, ZoomIn, ZoomOut } from 'lucide-vue-next';
import { computed, ref } from 'vue';

// 响应式数据
const showPanel = ref(true);
const showGrid = ref(false);
const zoomLevel = ref(100);
const sampleNode = ref<{ content: string; x: number; y: number } | null>(null);

// 计算属性
const sampleNodeStyle = computed(() => {
  if (!sampleNode.value) return {};
  return {
    transform: `translate(${sampleNode.value.x}px, ${sampleNode.value.y}px)`
  };
});

// 工具栏事件处理
function handleNewProject(): void {
  console.log('新建项目');
  sampleNode.value = null;
}

function handleSaveProject(): void {
  console.log('保存项目');
}

function handleLoadProject(): void {
  console.log('加载项目');
}

function handleDeleteNode(): void {
  console.log('删除节点');
  sampleNode.value = null;
}

function handleZoomIn(): void {
  zoomLevel.value = Math.min(200, zoomLevel.value + 25);
  console.log(`放大到 ${zoomLevel.value}%`);
}

function handleZoomOut(): void {
  zoomLevel.value = Math.max(50, zoomLevel.value - 25);
  console.log(`缩小到 ${zoomLevel.value}%`);
}

// 其他功能
function createSampleNode(): void {
  sampleNode.value = {
    content: '示例节点 - 展示新样式',
    x: 300,
    y: 200
  };
}

function toggleGrid(): void {
  showGrid.value = !showGrid.value;
}

function togglePanel(): void {
  showPanel.value = !showPanel.value;
}

// 日志输出
console.log('InkDot 应用已加载 - 使用新的CSS样式系统');
</script>
