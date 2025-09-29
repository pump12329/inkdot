import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useResponsiveLayout() {
  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);
  const screenWidth = ref(0);
  const screenHeight = ref(0);

  // 响应式断点
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200
  };

  // 计算设备类型
  function updateDeviceType(): void {
    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;

    isMobile.value = screenWidth.value <= breakpoints.mobile;
    isTablet.value =
      screenWidth.value > breakpoints.mobile && screenWidth.value <= breakpoints.tablet;
    isDesktop.value = screenWidth.value > breakpoints.tablet;
  }

  // 获取响应式布局参数
  const layoutParams = computed(() => {
    if (isMobile.value) {
      return {
        nodeWidth: 160,
        nodeHeight: 50,
        horizontalSpacing: 30,
        verticalSpacing: 60,
        fontSize: 12,
        padding: 20,
        controlsSize: 'small'
      };
    } else if (isTablet.value) {
      return {
        nodeWidth: 180,
        nodeHeight: 55,
        horizontalSpacing: 35,
        verticalSpacing: 70,
        fontSize: 13,
        padding: 30,
        controlsSize: 'medium'
      };
    } else {
      return {
        nodeWidth: 200,
        nodeHeight: 60,
        horizontalSpacing: 40,
        verticalSpacing: 80,
        fontSize: 14,
        padding: 50,
        controlsSize: 'large'
      };
    }
  });

  // 获取触摸设备支持
  const isTouchDevice = computed(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  // 获取最佳缩放级别
  const getOptimalZoom = computed(() => {
    if (isMobile.value) {
      return 0.8;
    } else if (isTablet.value) {
      return 0.9;
    } else {
      return 1;
    }
  });

  // 获取画布方向建议
  const canvasOrientation = computed(() => {
    if (isMobile.value) {
      return screenWidth.value > screenHeight.value ? 'landscape' : 'portrait';
    }
    return 'landscape';
  });

  // 检测横竖屏切换
  const isLandscape = computed(() => {
    return screenWidth.value > screenHeight.value;
  });

  // 生命周期
  onMounted(() => {
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    window.addEventListener('orientationchange', updateDeviceType);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceType);
    window.removeEventListener('orientationchange', updateDeviceType);
  });

  return {
    // 状态
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    isTouchDevice,
    isLandscape,

    // 计算属性
    layoutParams,
    getOptimalZoom,
    canvasOrientation,
    breakpoints
  };
}
