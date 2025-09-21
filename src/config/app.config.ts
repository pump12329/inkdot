import type { AppConfig } from '@/types'

// 应用配置
export const appConfig: AppConfig = {
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
        timeout: 10000,
        retries: 3
    },
    storage: {
        type: 'indexeddb',
        maxSize: 50 * 1024 * 1024 // 50MB
    },
    features: {
        ai: true,
        collaboration: false, // 第一阶段暂不启用
        plugins: true,
        export: true
    }
}

// 思维导图默认设置
export const defaultMindMapSettings = {
    theme: 'light' as const,
    layout: 'free' as const,
    zoom: 1,
    center: { x: 0, y: 0 },
    showGrid: true,
    snapToGrid: false
}

// AI服务配置
export const aiConfig = {
    deepseek: {
        apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
        baseUrl: 'https://api.deepseek.com/v1',
        model: 'deepseek-chat',
        defaultTemperature: 0.7,
        defaultMaxTokens: 2048
    },
    openrouter: {
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
        baseUrl: 'https://openrouter.ai/api/v1',
        defaultModel: 'anthropic/claude-3-haiku',
        defaultTemperature: 0.7,
        defaultMaxTokens: 2048
    }
}

// 画布配置
export const canvasConfig = {
    minZoom: 0.1,
    maxZoom: 5,
    defaultZoom: 1,
    gridSize: 20,
    nodeSize: {
        width: 120,
        height: 60
    },
    connection: {
        defaultColor: '#666',
        defaultWidth: 2,
        hoverColor: '#007acc'
    }
}

// 主题配置
export const themeConfig = {
    light: {
        background: '#ffffff',
        foreground: '#000000',
        primary: '#007acc',
        secondary: '#6c757d',
        accent: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        muted: '#6c757d',
        border: '#dee2e6'
    },
    dark: {
        background: '#1a1a1a',
        foreground: '#ffffff',
        primary: '#4dabf7',
        secondary: '#868e96',
        accent: '#51cf66',
        danger: '#ff6b6b',
        warning: '#ffd43b',
        info: '#74c0fc',
        muted: '#868e96',
        border: '#495057'
    }
}

// 快捷键配置
export const shortcutConfig = {
    'ctrl+n': 'new-node',
    'ctrl+d': 'duplicate-node',
    'delete': 'delete-node',
    'ctrl+s': 'save',
    'ctrl+z': 'undo',
    'ctrl+y': 'redo',
    'ctrl+f': 'search',
    'ctrl+g': 'toggle-grid',
    'ctrl+=': 'zoom-in',
    'ctrl+-': 'zoom-out',
    'ctrl+0': 'zoom-reset',
    'space': 'pan-mode',
    'escape': 'cancel'
}

// 导出所有配置
export default {
    app: appConfig,
    mindMap: defaultMindMapSettings,
    ai: aiConfig,
    canvas: canvasConfig,
    theme: themeConfig,
    shortcuts: shortcutConfig
}
