/**
 * 测试环境设置文件
 * 在所有测试运行前执行
 */

import { config } from 'vitest/config'
import { beforeAll, beforeEach, afterEach, afterAll } from 'vitest'

// 全局测试配置
export default {
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.d.ts',
        'src/main.ts',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000
  }
}

// 模拟全局对象
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// 模拟ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 模拟IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 模拟Canvas 2D上下文
HTMLCanvasElement.prototype.getContext = function(contextType: string) {
  if (contextType === '2d') {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: new Array(4) }),
      putImageData: () => {},
      createImageData: () => ({ data: new Array(4) }),
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    }
  }
  return null
}

// 测试前准备
beforeAll(() => {
  // 设置测试环境变量
  process.env.NODE_ENV = 'test'
  process.env.VITE_APP_TITLE = 'InkDot Test'
  
  // 禁用console.warn以减少测试输出噪音
  const originalWarn = console.warn
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('[Vue warn]')
    ) {
      return
    }
    originalWarn(...args)
  }
})

beforeEach(() => {
  // 清理DOM
  document.body.innerHTML = ''
  
  // 重置全局状态
  if (typeof window !== 'undefined') {
    window.localStorage.clear()
    window.sessionStorage.clear()
  }
  
  // 重置fetch mock
  if (typeof global !== 'undefined') {
    global.fetch = undefined as any
  }
})

afterEach(() => {
  // 清理所有定时器
  vi.clearAllTimers()
  
  // 重置所有mock
  vi.resetAllMocks()
  
  // 清理事件监听器
  if (typeof window !== 'undefined') {
    window.removeEventListener('beforeunload', () => {})
    window.removeEventListener('unload', () => {})
  }
})

afterAll(() => {
  // 清理测试环境
  vi.restoreAllMocks()
})