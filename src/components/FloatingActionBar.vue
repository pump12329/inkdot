<template>
  <div
    ref="barRef"
    class="floating-action-bar"
    :class="{
      show: isVisible,
      'compact-mode': isCompact
    }"
    role="toolbar"
    :aria-label="accessibilityLabel"
    :aria-hidden="!isVisible"
    tabindex="-1"
    @keydown="handleKeyDown"
  >
    <!-- 主按钮组 -->
    <div class="main-button-group">
      <!-- 添加根节点 -->
      <button
        ref="firstButtonRef"
        class="floating-action-btn primary"
        title="添加根节点"
        aria-label="添加根节点"
        @click="handleAddRootNode"
        @keydown="handleButtonKeydown($event, 'addRootNode')"
      >
        <Plus :size="14" :stroke-width="2" aria-hidden="true" />
      </button>

      <!-- 导入导出菜单 -->
      <div class="menu-dropdown" :class="{ open: showFileMenu }">
        <button
          class="floating-action-btn"
          title="导入导出"
          aria-label="导入导出"
          @click="toggleFileMenu"
          @keydown="handleButtonKeydown($event, 'fileMenu')"
        >
          <FileUp :size="12" :stroke-width="2" aria-hidden="true" />
        </button>
        <div class="dropdown-content">
          <button @click="handleImport">导入</button>
          <button @click="handleExport">导出</button>
        </div>
      </div>

      <!-- 缩放重置 -->
      <button
        class="floating-action-btn"
        title="重置缩放"
        aria-label="重置缩放"
        @click="handleResetZoom"
        @keydown="handleButtonKeydown($event, 'resetZoom')"
      >
        <Maximize :size="12" :stroke-width="2" aria-hidden="true" />
      </button>

      <!-- 深色模式切换 -->
      <button
        class="floating-action-btn"
        :title="isDarkMode ? '浅色模式' : '深色模式'"
        :aria-label="isDarkMode ? '浅色模式' : '深色模式'"
        @click="handleToggleTheme"
        @keydown="handleButtonKeydown($event, 'toggleTheme')"
      >
        <Moon v-if="isDarkMode" :size="12" :stroke-width="2" aria-hidden="true" />
        <Sun v-else :size="12" :stroke-width="2" aria-hidden="true" />
      </button>
    </div>

    <!-- 节点操作按钮组（仅在选中节点时显示） -->
    <div v-if="node" class="node-button-group">
      <div class="group-separator"></div>

      <!-- 添加子节点 -->
      <button
        class="floating-action-btn"
        :title="addChildLabel"
        :aria-label="addChildLabel"
        :disabled="!canAddChild"
        @click="handleAddChild"
        @keydown="handleButtonKeydown($event, 'addChild')"
      >
        <Plus :size="10" :stroke-width="2" aria-hidden="true" />
      </button>

      <!-- 编辑节点 -->
      <button
        class="floating-action-btn"
        :title="editLabel"
        :aria-label="editLabel"
        :disabled="!canEdit"
        @click="handleEdit"
        @keydown="handleButtonKeydown($event, 'edit')"
      >
        <Edit :size="10" :stroke-width="2" aria-hidden="true" />
      </button>

      <!-- 复制节点 -->
      <button
        class="floating-action-btn"
        :title="copyLabel"
        :aria-label="copyLabel"
        :disabled="!canCopy"
        @click="handleCopy"
        @keydown="handleButtonKeydown($event, 'copy')"
      >
        <Copy :size="10" :stroke-width="2" aria-hidden="true" />
      </button>

      <!-- 折叠/展开分支 -->
      <button
        class="floating-action-btn"
        :title="isExpanded ? collapseLabel : expandLabel"
        :aria-label="isExpanded ? collapseLabel : expandLabel"
        :disabled="!canToggleExpand"
        @click="handleToggleExpand"
        @keydown="handleButtonKeydown($event, 'toggleExpand')"
      >
        <ChevronDown v-if="isExpanded" :size="10" :stroke-width="2" aria-hidden="true" />
        <ChevronRight v-else :size="10" :stroke-width="2" aria-hidden="true" />
      </button>

      <!-- 删除节点 -->
      <button
        class="floating-action-btn danger"
        :title="deleteLabel"
        :aria-label="deleteLabel"
        :disabled="!canDelete"
        @click="handleDelete"
        @keydown="handleButtonKeydown($event, 'delete')"
      >
        <Trash2 :size="10" :stroke-width="2" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MindMapNode } from '@/types';
import { computed, nextTick, ref, watch, onUnmounted } from 'vue';
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  ChevronDown,
  ChevronRight,
  FileUp,
  Maximize,
  Sun,
  Moon
} from 'lucide-vue-next';

// Props
interface Props {
  node: MindMapNode | null;
  isVisible: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  addRootNode: [];
  addChild: [nodeId: string];
  edit: [nodeId: string];
  copy: [nodeId: string];
  delete: [nodeId: string];
  toggleExpand: [nodeId: string];
  import: [];
  export: [];
  resetZoom: [];
  toggleTheme: [];
  close: [];
}>();

// Refs
const barRef = ref<HTMLElement | null>(null);
const firstButtonRef = ref<HTMLElement | null>(null);
const currentFocusedIndex = ref<number>(0);
const showFileMenu = ref<boolean>(false);
const isDarkMode = ref<boolean>(false);

// 计算属性
const isCompact = computed(() => {
  // 移动端或小屏幕时使用紧凑模式
  return window.innerWidth < 768;
});

const canAddChild = computed(() => props.node !== null);
const canEdit = computed(() => props.node !== null);
const canCopy = computed(() => props.node !== null);
const canDelete = computed(() => props.node !== null);
const canToggleExpand = computed(() => props.node !== null && props.hasChildren);

const accessibilityLabel = computed(() => {
  return props.node ? `节点操作工具栏 - ${props.node.content || '未命名节点'}` : '节点操作工具栏';
});

const addChildLabel = computed(() => '添加子节点');
const editLabel = computed(() => '编辑节点');
const copyLabel = computed(() => '复制节点');
const deleteLabel = computed(() => '删除节点');
const expandLabel = computed(() => '展开分支');
const collapseLabel = computed(() => '折叠分支');

// 事件处理方法
function handleAddRootNode(): void {
  emit('addRootNode');
}

function handleAddChild(): void {
  if (props.node && canAddChild.value) {
    emit('addChild', props.node.id);
  }
}

function toggleFileMenu(): void {
  showFileMenu.value = !showFileMenu.value;
}

function handleImport(): void {
  emit('import');
  showFileMenu.value = false;
}

function handleExport(): void {
  emit('export');
  showFileMenu.value = false;
}

function handleResetZoom(): void {
  emit('resetZoom');
}

function handleToggleTheme(): void {
  isDarkMode.value = !isDarkMode.value;
  emit('toggleTheme');
}

function handleEdit(): void {
  if (props.node && canEdit.value) {
    emit('edit', props.node.id);
  }
}

function handleCopy(): void {
  if (props.node && canCopy.value) {
    emit('copy', props.node.id);
  }
}

function handleDelete(): void {
  if (props.node && canDelete.value) {
    emit('delete', props.node.id);
  }
}

function handleToggleExpand(): void {
  if (props.node && canToggleExpand.value) {
    emit('toggleExpand', props.node.id);
  }
}

// 键盘导航
function handleKeyDown(event: KeyboardEvent): void {
  if (!props.isVisible) return;

  switch (event.key) {
    case 'Escape':
      event.preventDefault();
      emit('close');
      break;
    case 'ArrowRight':
      event.preventDefault();
      navigateButtons(1);
      break;
    case 'ArrowLeft':
      event.preventDefault();
      navigateButtons(-1);
      break;
    case 'ArrowDown':
    case 'ArrowUp':
      event.preventDefault();
      break;
    case 'Tab':
      event.preventDefault();
      navigateButtons(event.shiftKey ? -1 : 1);
      break;
  }
}

function handleButtonKeydown(event: KeyboardEvent, action: string): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    // 触发对应的操作
    switch (action) {
      case 'addRootNode':
        handleAddRootNode();
        break;
      case 'fileMenu':
        toggleFileMenu();
        break;
      case 'resetZoom':
        handleResetZoom();
        break;
      case 'toggleTheme':
        handleToggleTheme();
        break;
      case 'addChild':
        handleAddChild();
        break;
      case 'edit':
        handleEdit();
        break;
      case 'copy':
        handleCopy();
        break;
      case 'delete':
        handleDelete();
        break;
      case 'toggleExpand':
        handleToggleExpand();
        break;
    }
  }
}

function navigateButtons(direction: number): void {
  const buttons = barRef.value?.querySelectorAll('button') || [];
  if (buttons.length === 0) return;

  currentFocusedIndex.value =
    (currentFocusedIndex.value + direction + buttons.length) % buttons.length;

  const buttonToFocus = buttons[currentFocusedIndex.value] as HTMLElement;
  buttonToFocus.focus();
}

// 监听显示状态变化，自动聚焦第一个按钮
watch(
  () => props.isVisible,
  async newIsVisible => {
    if (newIsVisible) {
      await nextTick();
      currentFocusedIndex.value = 0;
      firstButtonRef.value?.focus();
    }
  }
);

// 监听节点变化，重置焦点
watch(
  () => props.node?.id,
  () => {
    currentFocusedIndex.value = 0;
  }
);

// 点击外部关闭按钮栏
function handleClickOutside(event: MouseEvent): void {
  if (props.isVisible && barRef.value && !barRef.value.contains(event.target as Node)) {
    showFileMenu.value = false;
    emit('close');
  }
}

// 监听全局点击事件
if (typeof window !== 'undefined') {
  watch(
    () => props.isVisible,
    isVisible => {
      if (isVisible) {
        document.addEventListener('click', handleClickOutside);
      } else {
        document.removeEventListener('click', handleClickOutside);
      }
    }
  );
}

// 清理事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* 移动端响应式优化 */
@media (max-width: 768px) {
  .floating-action-bar {
    top: 16px;
    left: 16px;
  }

  .floating-action-bar.compact-mode {
    top: 12px;
    left: 12px;
  }

  /* 移动端水平滚动布局 */
  .main-button-group {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .main-button-group::-webkit-scrollbar {
    display: none;
  }

  .node-button-group {
    display: none; /* 移动端隐藏节点操作按钮 */
  }

  /* 移动端下拉菜单适配 */
  .menu-dropdown .dropdown-content {
    left: auto;
    right: 0;
    min-width: 100px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .floating-action-bar {
    top: 12px;
    left: 12px;
    right: 12px;
  }

  .main-button-group {
    justify-content: space-between;
    width: 100%;
  }

  .floating-action-btn {
    min-width: 40px;
    min-height: 40px;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .circular-button-group {
    background: rgba(31, 41, 55, 0.95);
    border-color: rgba(75, 85, 99, 0.3);
  }

  .floating-action-btn {
    color: #9ca3af;
  }

  .floating-action-btn:hover:not(:disabled) {
    background: #374151;
    color: #f9fafb;
  }

  .floating-action-btn.primary {
    background: #f9fafb;
    color: #111827;
  }

  .floating-action-btn.primary:hover:not(:disabled) {
    background: #ffffff;
  }

  .floating-action-btn.danger {
    color: #ef4444;
  }

  .floating-action-btn.danger:hover:not(:disabled) {
    background: #450a0a;
    color: #fca5a5;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .floating-action-bar {
    border-width: 2px;
  }

  .floating-action-btn {
    border-width: 2px;
    font-weight: 600;
  }

  .floating-action-separator {
    background: currentColor;
    opacity: 0.8;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .floating-action-bar {
    background: rgba(17, 24, 39, 0.98);
    border-color: #374151;
  }

  .floating-action-btn {
    background: transparent;
    border-color: transparent;
    color: #d1d5db;
  }

  .floating-action-btn:hover {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .floating-action-btn.primary {
    background: #f9fafb;
    color: #111827;
  }

  .floating-action-btn.primary:hover {
    background: #ffffff;
    color: #111827;
  }

  .floating-action-btn.danger:hover {
    background: #7f1d1d;
    border-color: #dc2626;
    color: #fee2e2;
  }

  .floating-action-separator {
    background: #374151;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .floating-action-bar,
  .floating-action-btn {
    transition: none;
  }

  .floating-action-btn:hover,
  .floating-action-btn:active {
    transform: none;
  }
}

/* 触摸设备优化 */
@media (hover: none) {
  .floating-action-btn {
    min-width: 44px;
    min-height: 44px;
  }

  .floating-action-btn:hover {
    transform: none;
  }

  .floating-action-btn:active {
    transform: scale(0.95);
  }

  .floating-action-bar {
    background: rgba(255, 255, 255, 0.98);
  }

  @media (prefers-color-scheme: dark) {
    .floating-action-bar {
      background: rgba(26, 26, 26, 0.98);
    }
  }
}

/* 键盘导航指示 */
.floating-action-bar:focus-within {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.floating-action-btn:focus {
  z-index: 1;
}

/* 悬浮操作栏基础样式 - 画布相对定位 */
.floating-action-bar {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000 !important;
  opacity: 1 !important;
  transform: scale(1) translateY(0) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

.floating-action-bar.show {
  opacity: 1;
  transform: scale(1) translateY(0);
  pointer-events: auto;
}

/* 主按钮组 */
.main-button-group {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 3px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  gap: 1px;
  align-items: center;
}

/* 节点操作按钮组 */
.node-button-group {
  display: flex;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  gap: 1px;
  align-items: center;
  margin-left: 8px;
}

/* 分组分隔线 */
.group-separator {
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 2px;
}

/* 下拉菜单 */
.menu-dropdown {
  position: relative;
}

.menu-dropdown .dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 80px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.2s ease;
  z-index: 1000;
}

.menu-dropdown.open .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.menu-dropdown .dropdown-content button {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 12px;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-dropdown .dropdown-content button:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* 紧凑模式 - 更小的按钮和间距 */
.floating-action-bar.compact-mode .circular-button-group {
  padding: 3px;
  gap: 1px;
  border-radius: 20px;
}

/* 悬浮按钮样式 - 极简圆形设计 */
.floating-action-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 14px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 12px;
  line-height: 1;
  user-select: none;
  outline: none;
  overflow: hidden;
  flex-shrink: 0;
}

/* 主要操作按钮 - 添加子节点 */
.floating-action-btn.primary {
  background: #1f2937;
  color: #ffffff;
}

.floating-action-btn.primary:hover:not(:disabled) {
  background: #111827;
  transform: scale(1.05);
}

.floating-action-btn:hover:not(:disabled) {
  background: #f9fafb;
  color: #1f2937;
  transform: scale(1.05);
}

.floating-action-btn:focus-visible:not(:disabled) {
  outline: 2px solid #1f2937;
  outline-offset: 2px;
  z-index: 1;
}

.floating-action-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.floating-action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.floating-action-btn.danger {
  color: #dc2626;
}

.floating-action-btn.danger:hover:not(:disabled) {
  background: #fef2f2;
  color: #b91c1c;
}

/* 紧凑模式下的按钮 */
.floating-action-bar.compact-mode .floating-action-btn {
  width: 24px;
  height: 24px;
  font-size: 11px;
}

.floating-action-bar.compact-mode .floating-action-btn.primary {
  width: 28px;
  height: 28px;
}

/* 屏幕阅读器优化 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

[aria-hidden='true'] {
  display: none;
}

/* 打印优化 */
@media print {
  .floating-action-bar {
    display: none !important;
  }
}
</style>
