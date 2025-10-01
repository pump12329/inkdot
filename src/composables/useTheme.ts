import { ref, computed, watch, onMounted } from 'vue';

type ThemeMode = 'light' | 'dark' | 'auto';

export function useTheme() {
  // 状态
  const themeMode = ref<ThemeMode>('auto');
  const currentTheme = ref<'light' | 'dark'>('light');
  const isSystemDark = ref(false);

  // 计算属性
  const isDarkMode = computed(() => {
    if (themeMode.value === 'auto') {
      return isSystemDark.value;
    }
    return themeMode.value === 'dark';
  });

  const themeIcon = computed(() => {
    if (themeMode.value === 'auto') {
      return isSystemDark.value ? 'Moon' : 'Sun';
    }
    return themeMode.value === 'dark' ? 'Sun' : 'Moon';
  });

  const themeLabel = computed(() => {
    if (themeMode.value === 'auto') {
      return isSystemDark.value ? '深色模式' : '浅色模式';
    }
    return themeMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式';
  });

  // 方法
  function setTheme(mode: ThemeMode): void {
    themeMode.value = mode;
    saveThemePreference(mode);
    updateCurrentTheme();
  }

  function toggleTheme(): void {
    if (themeMode.value === 'auto') {
      setTheme(isSystemDark.value ? 'light' : 'dark');
    } else {
      setTheme(themeMode.value === 'light' ? 'dark' : 'light');
    }
  }

  function toggleThemeMode(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(themeMode.value);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme(modes[nextIndex]);
  }

  function updateCurrentTheme(): void {
    if (themeMode.value === 'auto') {
      currentTheme.value = isSystemDark.value ? 'dark' : 'light';
    } else {
      currentTheme.value = themeMode.value;
    }
    applyTheme(currentTheme.value);
  }

  function applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;

    // 移除之前的主题类
    root.classList.remove('theme-light', 'theme-dark');

    // 添加当前主题类
    root.classList.add(`theme-${theme}`);

    // 设置CSS变量
    if (theme === 'dark') {
      root.style.setProperty('--color-background', '#111827');
      root.style.setProperty('--color-surface', '#1f2937');
      root.style.setProperty('--color-surface-hover', '#374151');
      root.style.setProperty('--color-border', '#374151');
      root.style.setProperty('--color-border-hover', '#4b5563');
      root.style.setProperty('--color-text-primary', '#f9fafb');
      root.style.setProperty('--color-text-secondary', '#d1d5db');
      root.style.setProperty('--color-text-tertiary', '#9ca3af');
      root.style.setProperty('--color-icon-primary', '#f9fafb');
      root.style.setProperty('--color-icon-secondary', '#d1d5db');
      root.style.setProperty('--color-accent', '#3b82f6');
      root.style.setProperty('--color-accent-hover', '#2563eb');
      root.style.setProperty('--color-success', '#10b981');
      root.style.setProperty('--color-error', '#ef4444');
      root.style.setProperty('--color-warning', '#f59e0b');
      root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)');
      root.style.setProperty(
        '--shadow-md',
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      );
      root.style.setProperty(
        '--shadow-lg',
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      );
    } else {
      root.style.setProperty('--color-background', '#ffffff');
      root.style.setProperty('--color-surface', '#f9fafb');
      root.style.setProperty('--color-surface-hover', '#f3f4f6');
      root.style.setProperty('--color-border', '#e5e7eb');
      root.style.setProperty('--color-border-hover', '#d1d5db');
      root.style.setProperty('--color-text-primary', '#111827');
      root.style.setProperty('--color-text-secondary', '#374151');
      root.style.setProperty('--color-text-tertiary', '#6b7280');
      root.style.setProperty('--color-icon-primary', '#374151');
      root.style.setProperty('--color-icon-secondary', '#6b7280');
      root.style.setProperty('--color-accent', '#3b82f6');
      root.style.setProperty('--color-accent-hover', '#2563eb');
      root.style.setProperty('--color-success', '#10b981');
      root.style.setProperty('--color-error', '#ef4444');
      root.style.setProperty('--color-warning', '#f59e0b');
      root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)');
      root.style.setProperty(
        '--shadow-md',
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      );
      root.style.setProperty(
        '--shadow-lg',
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      );
    }
  }

  function checkSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    isSystemDark.value = mediaQuery.matches;
    updateCurrentTheme();

    // 监听系统主题变化
    mediaQuery.addEventListener('change', e => {
      isSystemDark.value = e.matches;
      if (themeMode.value === 'auto') {
        updateCurrentTheme();
      }
    });
  }

  function saveThemePreference(mode: ThemeMode): void {
    try {
      localStorage.setItem('inkdot-theme', mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  function loadThemePreference(): ThemeMode {
    try {
      const saved = localStorage.getItem('inkdot-theme');
      if (saved === 'light' || saved === 'dark' || saved === 'auto') {
        return saved;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
    return 'auto';
  }

  // 监听主题模式变化
  watch(themeMode, () => {
    updateCurrentTheme();
  });

  // 监听系统主题变化
  watch(isSystemDark, () => {
    if (themeMode.value === 'auto') {
      updateCurrentTheme();
    }
  });

  // 生命周期
  onMounted(() => {
    // 加载保存的主题偏好
    themeMode.value = loadThemePreference();

    // 检查系统主题
    checkSystemTheme();

    // 应用初始主题
    updateCurrentTheme();
  });

  return {
    // 状态
    themeMode,
    currentTheme,
    isDarkMode,
    isSystemDark,

    // 计算属性
    themeIcon,
    themeLabel,

    // 方法
    setTheme,
    toggleTheme,
    toggleThemeMode,
    updateCurrentTheme,
    applyTheme
  };
}
