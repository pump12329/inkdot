import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Position } from '@/types';

export function useCanvasView() {
  // 视图状态
  const scale = ref(1);
  const offset = ref<Position>({ x: 0, y: 0 });
  const isPanning = ref(false);
  const panStart = ref<Position>({ x: 0, y: 0 });

  // 画布尺寸
  const canvasSize = ref({ width: 800, height: 600 });
  const containerSize = ref({ width: 800, height: 600 });

  // 计算内容尺寸
  const contentSize = ref({ width: 800, height: 600 });

  // 计算属性
  const transformStyle = computed(() => {
    return `translate(${offset.value.x}px, ${offset.value.y}px) scale(${scale.value})`;
  });

  const transformOrigin = computed(() => {
    return '0 0';
  });

  // 缩放功能
  function zoomIn(): void {
    setScale(Math.min(scale.value * 1.2, 3));
  }

  function zoomOut(): void {
    setScale(Math.max(scale.value / 1.2, 0.1));
  }

  function setScale(newScale: number): void {
    scale.value = Math.max(0.1, Math.min(3, newScale));
  }

  function resetZoom(): void {
    scale.value = 1;
    offset.value = { x: 0, y: 0 };
  }

  // 平移功能
  function startPan(event: MouseEvent): void {
    isPanning.value = true;
    panStart.value = {
      x: event.clientX - offset.value.x,
      y: event.clientY - offset.value.y
    };

    document.addEventListener('mousemove', handlePan);
    document.addEventListener('mouseup', endPan);
  }

  function handlePan(event: MouseEvent): void {
    if (!isPanning.value) return;

    offset.value = {
      x: event.clientX - panStart.value.x,
      y: event.clientY - panStart.value.y
    };
  }

  function endPan(): void {
    isPanning.value = false;
    document.removeEventListener('mousemove', handlePan);
    document.removeEventListener('mouseup', endPan);
  }

  // 键盘控制
  function handleKeyDown(event: KeyboardEvent): void {
    const panStep = 20;
    const zoomStep = 0.1;

    switch (event.key) {
      case 'ArrowUp':
        offset.value.y += panStep;
        break;
      case 'ArrowDown':
        offset.value.y -= panStep;
        break;
      case 'ArrowLeft':
        offset.value.x += panStep;
        break;
      case 'ArrowRight':
        offset.value.x -= panStep;
        break;
      case '+':
      case '=':
        setScale(scale.value + zoomStep);
        break;
      case '-':
      case '_':
        setScale(scale.value - zoomStep);
        break;
      case '0':
        resetZoom();
        break;
    }
  }

  // 自适应画布大小
  function fitToContent(padding: number = 50): void {
    if (contentSize.value.width === 0 || contentSize.value.height === 0) return;

    const availableWidth = containerSize.value.width - padding * 2;
    const availableHeight = containerSize.value.height - padding * 2;

    const scaleX = availableWidth / contentSize.value.width;
    const scaleY = availableHeight / contentSize.value.height;
    const newScale = Math.min(scaleX, scaleY, 1);

    scale.value = newScale;

    // 居中显示
    const scaledWidth = contentSize.value.width * newScale;
    const scaledHeight = contentSize.value.height * newScale;

    offset.value = {
      x: (containerSize.value.width - scaledWidth) / 2,
      y: (containerSize.value.height - scaledHeight) / 2
    };
  }

  // 更新内容尺寸
  function updateContentSize(width: number, height: number): void {
    contentSize.value = { width, height };

    // 如果是首次设置，自动适应内容
    if (canvasSize.value.width === 800 && canvasSize.value.height === 600) {
      setTimeout(() => fitToContent(), 100);
    }
  }

  // 更新容器尺寸
  function updateContainerSize(width: number, height: number): void {
    containerSize.value = { width, height };
  }

  // 监听窗口大小变化
  function handleResize(): void {
    const container = document.querySelector('.canvas-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      updateContainerSize(rect.width, rect.height);
    }
  }

  // 生命周期
  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  // 计算画布边界
  function getCanvasBounds(containerWidth: number, containerHeight: number) {
    return {
      minX: -containerWidth / scale.value,
      maxX: containerWidth / scale.value,
      minY: -containerHeight / scale.value,
      maxY: containerHeight / scale.value
    };
  }

  return {
    // 状态
    scale,
    offset,
    isPanning,
    canvasSize,
    containerSize,
    contentSize,

    // 计算属性
    transformStyle,
    transformOrigin,

    // 方法
    zoomIn,
    zoomOut,
    setScale,
    resetZoom,
    startPan,
    handlePan,
    endPan,
    handleKeyDown,
    fitToContent,
    updateContentSize,
    updateContainerSize,
    getCanvasBounds
  };
}
