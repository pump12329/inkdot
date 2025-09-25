/**
 * 视图管理组合式函数
 */

import { mathUtils } from '@/utils';
import { computed, readonly, ref } from 'vue';

interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

interface ViewportBounds {
  minZoom: number;
  maxZoom: number;
  width: number;
  height: number;
}

export function useViewport(bounds: ViewportBounds) {
  // 响应式状态
  const zoom = ref(1);
  const panX = ref(0);
  const panY = ref(0);
  const isDragging = ref(false);
  const lastPanPosition = ref({ x: 0, y: 0 });

  // 计算属性
  const transform = computed(() => ({
    scale: zoom.value,
    translateX: panX.value,
    translateY: panY.value
  }));

  const transformStyle = computed(() => ({
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
    transformOrigin: 'center center'
  }));

  const canZoomIn = computed(() => zoom.value < bounds.maxZoom);
  const canZoomOut = computed(() => zoom.value > bounds.minZoom);

  const zoomPercentage = computed(() => Math.round(zoom.value * 100));

  // 缩放方法
  function setZoom(newZoom: number, centerX?: number, centerY?: number): void {
    const constrainedZoom = mathUtils.clamp(newZoom, bounds.minZoom, bounds.maxZoom);

    if (centerX !== undefined && centerY !== undefined) {
      // 围绕指定点缩放
      const factor = constrainedZoom / zoom.value;
      panX.value = centerX - (centerX - panX.value) * factor;
      panY.value = centerY - (centerY - panY.value) * factor;
    }

    zoom.value = constrainedZoom;
  }

  function zoomIn(step = 0.1, centerX?: number, centerY?: number): void {
    setZoom(zoom.value + step, centerX, centerY);
  }

  function zoomOut(step = 0.1, centerX?: number, centerY?: number): void {
    setZoom(zoom.value - step, centerX, centerY);
  }

  function zoomToFit(contentBounds: { x: number; y: number; width: number; height: number }): void {
    const padding = 50;
    const availableWidth = bounds.width - padding * 2;
    const availableHeight = bounds.height - padding * 2;

    const scaleX = availableWidth / contentBounds.width;
    const scaleY = availableHeight / contentBounds.height;
    const newZoom = Math.min(scaleX, scaleY, bounds.maxZoom);

    // 居中显示
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const contentCenterX = contentBounds.x + contentBounds.width / 2;
    const contentCenterY = contentBounds.y + contentBounds.height / 2;

    zoom.value = newZoom;
    panX.value = centerX - contentCenterX * newZoom;
    panY.value = centerY - contentCenterY * newZoom;
  }

  function resetZoom(): void {
    zoom.value = 1;
    panX.value = 0;
    panY.value = 0;
  }

  // 平移方法
  function setPan(newPanX: number, newPanY: number): void {
    panX.value = newPanX;
    panY.value = newPanY;
  }

  function panBy(deltaX: number, deltaY: number): void {
    panX.value += deltaX;
    panY.value += deltaY;
  }

  function centerView(): void {
    panX.value = 0;
    panY.value = 0;
  }

  // 拖拽相关方法
  function startPan(x: number, y: number): void {
    isDragging.value = true;
    lastPanPosition.value = { x, y };
  }

  function updatePan(x: number, y: number): void {
    if (!isDragging.value) return;

    const deltaX = x - lastPanPosition.value.x;
    const deltaY = y - lastPanPosition.value.y;

    panBy(deltaX, deltaY);

    lastPanPosition.value = { x, y };
  }

  function stopPan(): void {
    isDragging.value = false;
  }

  // 坐标转换方法
  function screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - panX.value) / zoom.value,
      y: (screenY - panY.value) / zoom.value
    };
  }

  function worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX * zoom.value + panX.value,
      y: worldY * zoom.value + panY.value
    };
  }

  // 边界检查
  function isPointVisible(x: number, y: number): boolean {
    const screen = worldToScreen(x, y);
    return screen.x >= 0 && screen.x <= bounds.width && screen.y >= 0 && screen.y <= bounds.height;
  }

  function getVisibleBounds(): { x: number; y: number; width: number; height: number } {
    const topLeft = screenToWorld(0, 0);
    const bottomRight = screenToWorld(bounds.width, bounds.height);

    return {
      x: topLeft.x,
      y: topLeft.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y
    };
  }

  // 动画相法
  function animateToZoom(targetZoom: number, duration = 300): Promise<void> {
    return new Promise(resolve => {
      const startZoom = zoom.value;
      const startTime = Date.now();

      function animate(): void {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        zoom.value = startZoom + (targetZoom - startZoom) * easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }

      animate();
    });
  }

  function animateToPan(targetX: number, targetY: number, duration = 300): Promise<void> {
    return new Promise(resolve => {
      const startX = panX.value;
      const startY = panY.value;
      const startTime = Date.now();

      function animate(): void {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        panX.value = startX + (targetX - startX) * easedProgress;
        panY.value = startY + (targetY - startY) * easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }

      animate();
    });
  }

  return {
    // 状态
    zoom: readonly(zoom),
    panX: readonly(panX),
    panY: readonly(panY),
    isDragging: readonly(isDragging),
    transform,
    transformStyle,
    canZoomIn,
    canZoomOut,
    zoomPercentage,

    // 缩放方法
    setZoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    resetZoom,

    // 平移方法
    setPan,
    panBy,
    centerView,

    // 拖拽方法
    startPan,
    updatePan,
    stopPan,

    // 坐标转换
    screenToWorld,
    worldToScreen,

    // 边界检查
    isPointVisible,
    getVisibleBounds,

    // 动画方法
    animateToZoom,
    animateToPan
  };
}

// 导出类型
export type { ViewportBounds, ViewportState };
export type Viewport = ReturnType<typeof useViewport>;
