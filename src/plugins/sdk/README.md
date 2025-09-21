# 插件SDK
> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

插件SDK为第三方开发者提供统一的插件开发接口，支持热插拔和MCP集成。

## 🎯 核心功能

### 插件开发
- 统一的插件接口
- 类型安全的开发体验
- 热重载支持

### MCP集成
- Model Context Protocol支持
- 工具和资源访问
- 跨插件通信

### 插件管理
- 插件注册和发现
- 依赖管理
- 版本控制

## 📁 文件结构

```
sdk/
├── README.md              # 本文件
├── plugin-base.ts         # 基础插件类
├── plugin-manager.ts      # 插件管理器
├── mcp-client.ts          # MCP客户端
├── dev-tools.ts           # 开发工具
├── examples/              # 示例插件
│   ├── theme-plugin.ts
│   ├── export-plugin.ts
│   └── ai-plugin.ts
└── types.ts               # SDK类型定义
```

## 🔧 核心接口

### BasePlugin
```typescript
abstract class BasePlugin {
  abstract id: string;
  abstract name: string;
  abstract version: string;
  abstract description: string;
  
  // 生命周期钩子
  abstract onInstall(): Promise<void>;
  abstract onUninstall(): Promise<void>;
  abstract onEnable(): Promise<void>;
  abstract onDisable(): Promise<void>;
  
  // 插件功能
  abstract getCapabilities(): PluginCapability[];
  abstract execute(capability: string, input: any): Promise<any>;
}
```

### PluginManager
```typescript
interface PluginManager {
  // 插件管理
  installPlugin(plugin: BasePlugin): Promise<boolean>;
  uninstallPlugin(id: string): Promise<boolean>;
  enablePlugin(id: string): Promise<boolean>;
  disablePlugin(id: string): Promise<boolean>;
  
  // 插件查询
  getPlugin(id: string): BasePlugin | null;
  getInstalledPlugins(): BasePlugin[];
  getEnabledPlugins(): BasePlugin[];
  
  // 能力查询
  getCapabilities(): PluginCapability[];
  executeCapability(capability: string, input: any): Promise<any>;
}
```

## 🚀 开发示例

### 创建主题插件
```typescript
import { BasePlugin } from './plugin-base';

export class ThemePlugin extends BasePlugin {
  id = 'theme-plugin';
  name = '主题插件';
  version = '1.0.0';
  description = '提供多种主题选择';

  async onInstall() {
    console.log('主题插件已安装');
  }

  async onUninstall() {
    console.log('主题插件已卸载');
  }

  async onEnable() {
    // 应用主题
    this.applyTheme('default');
  }

  async onDisable() {
    // 恢复默认主题
    this.applyTheme('default');
  }

  getCapabilities() {
    return [
      {
        id: 'change-theme',
        name: '切换主题',
        description: '更改应用主题'
      }
    ];
  }

  async execute(capability: string, input: any) {
    if (capability === 'change-theme') {
      return this.applyTheme(input.theme);
    }
  }

  private applyTheme(theme: string) {
    // 实现主题切换逻辑
  }
}
```

### 使用插件
```typescript
import { PluginManager } from './plugin-manager';
import { ThemePlugin } from './examples/theme-plugin';

const pluginManager = new PluginManager();

// 安装插件
const themePlugin = new ThemePlugin();
await pluginManager.installPlugin(themePlugin);

// 启用插件
await pluginManager.enablePlugin('theme-plugin');

// 执行插件功能
await pluginManager.executeCapability('change-theme', { theme: 'dark' });
```

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
