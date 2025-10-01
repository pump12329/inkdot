import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Position } from '@/types';

export function useCanvasView() {
  // 视图状态
  const scale = ref(1);
  const offset = ref<Position>({ x: 0, y: 0 });
  const isPanning = ref(false);
  const panStart = ref<Position>({ x: 0, y: 0 });
  const lastPanPosition = ref<Position>({ x: 0, y: 0 });
  const velocity = ref<Position>({ x: 0, y: 0 });
  const isAnimating = ref(false);

  // 触摸状态
  const isTouching = ref(false);
  const touchStart = ref<Position>({ x: 0, y: 0 });
  const lastTouchDistance = ref(0);
  const touchCenter = ref<Position>({ x: 0, y: 0 });

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

  // 平移功能 - 桌面端
  function startPan(event: MouseEvent): void {
    // 如果点击的是可交互元素，不开始平移
    if ((event.target as HTMLElement).closest('button, .node, input')) {
      return;
    }

    isPanning.value = true;
    panStart.value = {
      x: event.clientX - offset.value.x,
      y: event.clientY - offset.value.y
    };
    lastPanPosition.value = { x: event.clientX, y: event.clientY };
    velocity.value = { x: 0, y: 0 };
    stopMomentumAnimation();

    document.addEventListener('mousemove', handlePan);
    document.addEventListener('mouseup', endPan);
  }

  function handlePan(event: MouseEvent): void {
    if (!isPanning.value) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    // 计算速度（用于惯性滑动）
    velocity.value = {
      x: currentX - lastPanPosition.value.x,
      y: currentY - lastPanPosition.value.y
    };

    offset.value = {
      x: currentX - panStart.value.x,
      y: currentY - panStart.value.y
    };

    lastPanPosition.value = { x: currentX, y: currentY };
  }

  function endPan(): void {
    if (!isPanning.value) return;

    isPanning.value = false;
    document.removeEventListener('mousemove', handlePan);
    document.removeEventListener('mouseup', endPan);

    // 开始惯性滑动
    startMomentumAnimation();
  }

  // 触摸事件处理
  function handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    isTouching.value = true;
    touchStart.value = { x: touch.clientX, y: touch.clientY };
    lastPanPosition.value = { x: touch.clientX, y: touch.clientY };
    velocity.value = { x: 0, y: 0 };
    stopMomentumAnimation();

    if (event.touches.length === 2) {
      // 双指缩放
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      lastTouchDistance.value = getTouchDistance(touch1, touch2);
      touchCenter.value = getTouchCenter(touch1, touch2);
    }

    event.preventDefault();
  }

  function handleTouchMove(event: TouchEvent): void {
    if (!isTouching.value) return;

    const touch = event.touches[0];

    if (event.touches.length === 1) {
      // 单指平移
      velocity.value = {
        x: touch.clientX - lastPanPosition.value.x,
        y: touch.clientY - lastPanPosition.value.y
      };

      offset.value = {
        x: touch.clientX - touchStart.value.x,
        y: touch.clientY - touchStart.value.y
      };
    } else if (event.touches.length === 2) {
      // 双指缩放
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = getTouchDistance(touch1, touch2);
      const scaleDelta = currentDistance / lastTouchDistance.value;

      // 以触摸中心为缩放原点
      const newScale = Math.max(0.1, Math.min(3, scale.value * scaleDelta));
      const scaleChange = newScale - scale.value;

      offset.value.x -= ((touchCenter.value.x - offset.value.x) * scaleChange) / scale.value;
      offset.value.y -= ((touchCenter.value.y - offset.value.y) * scaleChange) / scale.value;

      scale.value = newScale;
      lastTouchDistance.value = currentDistance;
    }

    lastPanPosition.value = { x: touch.clientX, y: touch.clientY };
    event.preventDefault();
  }

  function handleTouchEnd(event: TouchEvent): void {
    if (!isTouching.value) return;

    isTouching.value = false;

    if (event.touches.length === 0) {
      startMomentumAnimation();
    }

    event.preventDefault();
  }

  // 辅助函数
  function getTouchDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getTouchCenter(touch1: Touch, touch2: Touch): Position {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }

  // 惯性滑动动画
  function startMomentumAnimation(): void {
    const friction = 0.95;
    const minVelocity = 0.5;

    if (Math.abs(velocity.value.x) < minVelocity && Math.abs(velocity.value.y) < minVelocity) {
      return;
    }

    isAnimating.value = true;

    function animate() {
      if (!isAnimating.value) return;

      velocity.value.x *= friction;
      velocity.value.y *= friction;

      offset.value.x += velocity.value.x;
      offset.value.y += velocity.value.y;

      if (Math.abs(velocity.value.x) < minVelocity && Math.abs(velocity.value.y) < minVelocity) {
        isAnimating.value = false;
        return;
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function stopMomentumAnimation(): void {
    isAnimating.value = false;
    velocity.value = { x: 0, y: 0 };
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
    isTouching,
    isAnimating,
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
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeyDown,
    fitToContent,
    updateContentSize,
    updateContainerSize,
    getCanvasBounds
  };
}
