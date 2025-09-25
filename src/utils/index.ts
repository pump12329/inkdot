/**
 * 通用工具函数
 */

import type { DebouncedFunction, Validator } from '@/types';

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 生成UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      func();
      timeout = null;
    }
  };

  return debounced;
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let isThrottled = false;
  let lastCallTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (!isThrottled || now - lastCallTime >= wait) {
      func(...args);
      lastCallTime = now;
      isThrottled = true;
    }
  };
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * 深度合并对象
 */
export function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

/**
 * 判断值是否为空
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * 格式化日期
 */
export function formatDate(date: Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 获取相对时间
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}天前`;
  }

  if (hours > 0) {
    return `${hours}小时前`;
  }

  if (minutes > 0) {
    return `${minutes}分钟前`;
  }

  return '刚刚';
}

/**
 * 数字格式化
 */
export function formatNumber(num: number, decimals = 2): string {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * 文件大小格式化
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 颜色工具函数
 */
export const colorUtils = {
  /**
   * 十六进制颜色转RGB
   */
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  },

  /**
   * RGB转十六进制颜色
   */
  rgbToHex(r: number, g: number, b: number): string {
    const toHex = (c: number) => {
      const hex = Math.round(c).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  /**
   * 获取对比色
   */
  getContrastColor(hex: string): string {
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return '#000000';

    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  }
};

/**
 * DOM工具函数
 */
export const domUtils = {
  /**
   * 添加CSS类
   */
  addClass(element: Element, className: string): void {
    if (element.classList) {
      element.classList.add(className);
    } else {
      const classes = element.className.split(' ');
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        element.className = classes.join(' ');
      }
    }
  },

  /**
   * 移除CSS类
   */
  removeClass(element: Element, className: string): void {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      const classes = element.className.split(' ');
      const index = classes.indexOf(className);
      if (index > -1) {
        classes.splice(index, 1);
        element.className = classes.join(' ');
      }
    }
  },

  /**
   * 检查是否包含CSS类
   */
  hasClass(element: Element, className: string): boolean {
    if (element.classList) {
      return element.classList.contains(className);
    }
    return element.className.split(' ').indexOf(className) > -1;
  },

  /**
   * 获取元素位置
   */
  getOffset(element: Element): { top: number; left: number } {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  }
};

/**
 * 数学工具函数
 */
export const mathUtils = {
  /**
   * 计算两点间距离
   */
  distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  /**
   * 计算角度
   */
  angle(x1: number, y1: number, x2: number, y2: number): number {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  },

  /**
   * 限制数值范围
   */
  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * 线性插值
   */
  lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  },

  /**
   * 随机数生成
   */
  random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  },

  /**
   * 随机整数生成
   */
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

/**
 * 验证器函数
 */
export const validators = {
  /**
   * 邮箱验证
   */
  email: ((value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }) as Validator<string>,

  /**
   * URL验证
   */
  url: ((value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }) as Validator<string>,

  /**
   * 非空验证
   */
  required: ((value: unknown): boolean => !isEmpty(value)) as Validator<unknown>,

  /**
   * 最小长度验证
   */
  minLength:
    (min: number): Validator<string> =>
    (value: string): boolean =>
      value.length >= min,

  /**
   * 最大长度验证
   */
  maxLength:
    (max: number): Validator<string> =>
    (value: string): boolean =>
      value.length <= max,

  /**
   * 数字范围验证
   */
  range:
    (min: number, max: number): Validator<number> =>
    (value: number): boolean =>
      value >= min && value <= max
};

/**
 * 异步工具函数
 */
export const asyncUtils = {
  /**
   * 延迟执行
   */
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 重试函数
   */
  async retry<T>(fn: () => Promise<T>, maxAttempts = 3, delayMs = 1000): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          await asyncUtils.delay(delayMs);
        }
      }
    }

    throw lastError!;
  },

  /**
   * 超时控制
   */
  timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('操作超时')), ms))
    ]);
  }
};

/**
 * 存储工具函数
 */
export const storageUtils = {
  /**
   * 本地存储设置
   */
  setLocal<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage设置失败:', error);
    }
  },

  /**
   * 本地存储获取
   */
  getLocal<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('LocalStorage获取失败:', error);
      return defaultValue;
    }
  },

  /**
   * 本地存储删除
   */
  removeLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage删除失败:', error);
    }
  },

  /**
   * 会话存储设置
   */
  setSession<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('SessionStorage设置失败:', error);
    }
  },

  /**
   * 会话存储获取
   */
  getSession<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('SessionStorage获取失败:', error);
      return defaultValue;
    }
  },

  /**
   * 会话存储删除
   */
  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('SessionStorage删除失败:', error);
    }
  }
};
