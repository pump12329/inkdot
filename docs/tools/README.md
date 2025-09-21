# InkDot 项目工具

> **文档版本**：v1.0.0  
> **最后更新**：T0.3  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

本目录包含InkDot项目的辅助工具，用于提高开发和文档维护效率。

## 🛠️ 工具列表

### 📅 时间戳工具 (timestamp-helper.js)

用于管理项目时间戳系统的命令行工具。

#### 🎯 主要功能
- 获取当前项目时间戳
- 转换时间戳格式
- 计算审查时间
- 更新文档时间戳
- 生成文档头部信息

#### 📝 使用方法

```bash
# 获取当前时间戳
node docs/tools/timestamp-helper.js current

# 转换时间戳为详细信息
node docs/tools/timestamp-helper.js convert T1.5

# 计算下次审查时间 (默认30天后)
node docs/tools/timestamp-helper.js next-review T1.5

# 计算下次审查时间 (自定义间隔)
node docs/tools/timestamp-helper.js next-review T1.5 60

# 更新文档时间戳
node docs/tools/timestamp-helper.js update-doc docs/README.md

# 生成文档头部信息
node docs/tools/timestamp-helper.js header v1.0.0 T0 T1.5

# 显示帮助信息
node docs/tools/timestamp-helper.js help
```

#### 🔧 API 使用

```javascript
const { 
    getCurrentTimestamp, 
    formatTimestamp, 
    generateDocHeader 
} = require('./docs/tools/timestamp-helper.js');

// 获取当前时间戳
const current = getCurrentTimestamp();
console.log(current); // T0.1

// 格式化时间戳
const info = formatTimestamp('T1.5');
console.log(info);
// {
//   timestamp: 'T1.5',
//   days: 1,
//   hours: 5,
//   date: '2025-09-22',
//   description: '项目第1天第5小时'
// }

// 生成文档头部
const header = generateDocHeader('v1.0.0', 'T0');
console.log(header);
```

## 📋 时间戳系统说明

### 🕐 基准时间
- **项目启动时间**：2025-09-21 00:00:00 UTC
- **时间戳T0**：对应项目启动时间

### 📅 时间戳格式
- `T{天数}` - 整天时间戳 (如 T1, T30)
- `T{天数}.{小时}` - 精确到小时 (如 T1.5, T30.12)

### 🔄 常用时间戳
| 时间戳 | 含义 | 用途 |
|--------|------|------|
| T0 | 项目启动 | 初始文档创建 |
| T1 | 项目第1天 | 文档结构化 |
| T7 | 项目第1周 | 周度检查 |
| T30 | 项目第1月 | 月度审查 |
| T90 | 项目第3月 | 季度审查 |

## 🚀 快速开始

### 1. 获取当前时间戳
```bash
# 方法1: 使用工具
node docs/tools/timestamp-helper.js current

# 方法2: 手动计算
# 当前日期 - 2025-09-21 = 天数差
# 例如: 2025-09-22 = T1
```

### 2. 更新文档时间戳
```bash
# 自动更新为当前时间戳
node docs/tools/timestamp-helper.js update-doc docs/README.md

# 指定时间戳更新
node docs/tools/timestamp-helper.js update-doc docs/README.md T2.5
```

### 3. 创建新文档
```bash
# 生成文档头部信息
node docs/tools/timestamp-helper.js header v1.0.0 T0.1

# 输出示例:
# > **文档版本**：v1.0.0  
# > **创建时间戳**：T0.1  
# > **最后更新**：T0.1  
# > **状态**：🟢 CURRENT  
# > **维护者**：InkDot开发团队  
# > **下次审查**：T30.1
```

## 📋 最佳实践

### 🎯 时间戳使用原则
1. **创建时间戳**：文档首次创建时设定，不再更改
2. **更新时间戳**：每次重要修改时更新
3. **审查时间戳**：定期审查时更新

### 🔄 更新频率
- **重大修改**：立即更新时间戳
- **小幅修改**：可延迟到批量更新
- **定期审查**：按审查周期更新

### 📝 文档维护
- 使用工具自动更新时间戳
- 保持时间戳的一致性
- 记录重要变更的时间戳

## 🔧 工具扩展

### 添加新工具
1. 在 `docs/tools/` 目录创建新工具文件
2. 添加执行权限：`chmod +x filename`
3. 更新本README文档
4. 添加使用示例和说明

### 工具开发规范
- 使用Node.js编写
- 提供命令行接口
- 包含详细的帮助信息
- 支持API调用

---

## 📋 文档信息

| 属性 | 值 |
|------|----|
| 文档版本 | v1.0.0 |
| 创建时间戳 | T0 |
| 最后更新 | T0.1 |
| 状态 | 🟢 CURRENT |
| 维护者 | InkDot开发团队 |
| 审查周期 | T30 (月度) |
| 下次审查 | T30.1 |

### 📅 版本历史
- **v1.0.0** (T0.1) - 创建时间戳工具和使用文档，更新基准时间为2025-09-21

### 📝 变更说明
本文档介绍项目工具的使用方法。新增工具时请及时更新此文档。
