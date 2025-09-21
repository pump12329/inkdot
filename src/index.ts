// InkDot 主入口文件
// 导出所有核心模块和公共API

// 核心模块
export * from './core/mindmap';
export * from './core/workspace';
export * from './core/agent';
export * from './core/plugin-manager';

// AI集成
export * from './ai/agents';
export * from './ai/mcp';
export * from './ai/langchain';

// 服务层
export * from './services/api';
export * from './services/database';
export * from './services/storage';

// 插件系统
export * from './plugins/sdk';
export * from './plugins/registry';

// UI组件
export * from './ui/components';
export * from './ui/composables';
export * from './ui/stores';

// 类型定义
export * from './types';

// 工具函数
export * from './utils';

// 版本信息
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();
