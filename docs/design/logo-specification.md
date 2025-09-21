# 墨点 Logo 设计规范文档

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 目录

1. [品牌概述](#品牌概述)
2. [设计理念](#设计理念)
3. [Logo构成](#logo构成)
4. [技术规格](#技术规格)
5. [颜色系统](#颜色系统)
6. [尺寸规范](#尺寸规范)
7. [应用场景](#应用场景)
8. [动画效果](#动画效果)
9. [文件资源](#文件资源)
10. [使用规范](#使用规范)

---

## 品牌概述

### 品牌名称
- **中文名称**: 墨点
- **英文名称**: InkDot
- **品牌定位**: AI驱动的智能小说创作平台
- **核心价值**: 从一个墨点开始，创造无限故事

### 设计原则
- **极简主义**: 简洁有力，一目了然
- **高识别度**: 独特的视觉记忆点
- **可扩展性**: 适应各种应用场景
- **文化融合**: 传统文学与现代科技的结合

---

## 设计理念

### 核心概念：墨点星云
墨点星云Logo将传统的"墨点"概念与现代的"星云网络"相结合，象征着：

1. **创作起源**: 中心墨点代表创作的起点
2. **思维扩散**: 8个方向代表思维的无限延展
3. **网络连接**: 连接线象征AI与人类创作的协作
4. **星云美学**: 整体呈现宇宙星云的神秘美感

### 文化寓意
- **墨**: 传统文学的载体，书香文化的象征
- **点**: 数字时代的像素单位，现代科技的体现
- **星云**: 宇宙的奥秘，无限创作可能的象征
- **网络**: 连接与协作，AI时代的特征

---

## Logo构成

### 主要元素

#### 1. 中心墨点
```
● (直径: 18px)
位置: 画布中心 (60, 60)
颜色: 纯黑 #000000
功能: 创作核心，品牌识别点
```

#### 2. 外围墨点
```
● × 8 (直径: 10px)
位置: 8个方向，距离中心36px
颜色: 深灰 #333333
功能: 创意扩散，思维节点
```

#### 3. 连接线
```
── × 8 (宽度: 2px, 长度: 36px)
颜色: 科技蓝 #0066FF
功能: 网络连接，关系表达
```

### 整体结构
```
         ●
       ╱─┼─╲
      ╱  │  ╲
     ●   │   ●
    ╱    │    ╲
   ╱     │     ╲
  ●──────●──────●
   ╲     │     ╱
    ╲    │    ╱
     ●   │   ●
      ╲  │  ╱
       ╲─┼─╱
         ●
```

---

## 技术规格

### SVG基础代码
```svg
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 中心点渐变 -->
    <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#333333;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#666666;stop-opacity:1" />
    </radialGradient>
    
    <!-- 连接线渐变 -->
    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0066FF;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#00FFFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0066FF;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 连接线组 -->
  <g id="connections" stroke="url(#lineGradient)" stroke-width="2" fill="none">
    <line x1="60" y1="60" x2="60" y2="24" />           <!-- 上 -->
    <line x1="60" y1="60" x2="85.5" y2="34.5" />       <!-- 右上 -->
    <line x1="60" y1="60" x2="96" y2="60" />            <!-- 右 -->
    <line x1="60" y1="60" x2="85.5" y2="85.5" />       <!-- 右下 -->
    <line x1="60" y1="60" x2="60" y2="96" />            <!-- 下 -->
    <line x1="60" y1="60" x2="34.5" y2="85.5" />       <!-- 左下 -->
    <line x1="60" y1="60" x2="24" y2="60" />            <!-- 左 -->
    <line x1="60" y1="60" x2="34.5" y2="34.5" />       <!-- 左上 -->
  </g>
  
  <!-- 墨点组 -->
  <g id="dots">
    <!-- 外围墨点 -->
    <circle cx="60" cy="24" r="5" fill="#333333" />     <!-- 上 -->
    <circle cx="85.5" cy="34.5" r="5" fill="#333333" /> <!-- 右上 -->
    <circle cx="96" cy="60" r="5" fill="#333333" />     <!-- 右 -->
    <circle cx="85.5" cy="85.5" r="5" fill="#333333" /> <!-- 右下 -->
    <circle cx="60" cy="96" r="5" fill="#333333" />     <!-- 下 -->
    <circle cx="34.5" cy="85.5" r="5" fill="#333333" /> <!-- 左下 -->
    <circle cx="24" cy="60" r="5" fill="#333333" />     <!-- 左 -->
    <circle cx="34.5" cy="34.5" r="5" fill="#333333" /> <!-- 左上 -->
    
    <!-- 中心墨点 -->
    <circle cx="60" cy="60" r="9" fill="url(#centerGradient)" />
  </g>
</svg>
```

### 坐标定位表
| 位置 | 角度 | X坐标 | Y坐标 | 说明 |
|------|------|-------|-------|------|
| 中心 | - | 60 | 60 | 画布中心 |
| 上 | 0° | 60 | 24 | 正上方 |
| 右上 | 45° | 85.5 | 34.5 | 东北方向 |
| 右 | 90° | 96 | 60 | 正右方 |
| 右下 | 135° | 85.5 | 85.5 | 东南方向 |
| 下 | 180° | 60 | 96 | 正下方 |
| 左下 | 225° | 34.5 | 85.5 | 西南方向 |
| 左 | 270° | 24 | 60 | 正左方 |
| 左上 | 315° | 34.5 | 34.5 | 西北方向 |

---

## 颜色系统

### 主色调
```css
/* CSS变量定义 */
:root {
  --ink-black:      #000000;    /* 中心墨点 */
  --ink-gray:       #333333;    /* 外围墨点 */
  --connection-blue: #0066FF;    /* 连接线主色 */
  --accent-cyan:    #00FFFF;    /* 强调色 */
  --bg-white:       #FFFFFF;    /* 背景色 */
  --text-gray:      #666666;    /* 辅助文字 */
}
```

### 颜色应用规则

#### 主要应用
- **中心墨点**: 始终使用纯黑色或径向渐变
- **外围墨点**: 深灰色，与中心形成层次
- **连接线**: 科技蓝，体现现代感
- **背景**: 纯白色或透明

#### 特殊场景
- **黑色背景**: 使用白色或亮色版本
- **彩色背景**: 使用黑白版本保证对比度
- **印刷应用**: 提供单色版本

### 渐变配置
```css
/* 中心墨点径向渐变 */
.center-gradient {
  background: radial-gradient(
    circle at center,
    #000000 0%,
    #333333 70%,
    #666666 100%
  );
}

/* 连接线渐变 */
.line-gradient {
  background: linear-gradient(
    var(--direction),
    #0066FF 0%,
    #00FFFF 50%,
    #0066FF 100%
  );
}
```

---

## 尺寸规范

### 标准尺寸系统

#### 超大尺寸 (200px+)
```
画布: 200×200px
中心墨点: 直径 30px
外围墨点: 直径 16px
连接线: 宽度 4px
间距: 60px
用途: 网站头部、宣传海报
```

#### 大尺寸 (120px)
```
画布: 120×120px
中心墨点: 直径 18px
外围墨点: 直径 10px
连接线: 宽度 2px
间距: 36px
用途: 标准Logo、文档封面
```

#### 中尺寸 (80px)
```
画布: 80×80px
中心墨点: 直径 12px
外围墨点: 直径 6px
连接线: 宽度 1.5px
间距: 24px
用途: 应用图标、按钮
```

#### 小尺寸 (48px)
```
画布: 48×48px
中心墨点: 直径 8px
外围墨点: 直径 4px
连接线: 宽度 1px
间距: 14px
用途: 菜单图标、标签页
```

#### 极小尺寸 (32px)
```
画布: 32×32px
简化为 5个点结构
用途: 状态栏、通知图标
```

### 响应式CSS
```css
/* 基础尺寸 */
.logo {
  width: 120px;
  height: 120px;
}

/* 媒体查询适配 */
@media (max-width: 768px) {
  .logo { width: 80px; height: 80px; }
}

@media (max-width: 480px) {
  .logo { width: 48px; height: 48px; }
}

/* 尺寸变体类 */
.logo-xl { width: 200px; height: 200px; }
.logo-lg { width: 120px; height: 120px; }
.logo-md { width: 80px; height: 80px; }
.logo-sm { width: 48px; height: 48px; }
.logo-xs { width: 32px; height: 32px; }
```

---

## 应用场景

### 1. 网站应用

#### 网站头部
```html
<header class="site-header">
  <div class="logo-container">
    <svg class="logo logo-lg"><!-- SVG内容 --></svg>
    <h1 class="brand-name">墨点</h1>
  </div>
</header>
```

```css
.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-name {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}
```

#### 页脚
```html
<footer class="site-footer">
  <div class="footer-logo">
    <svg class="logo logo-md"><!-- SVG内容 --></svg>
    <span class="copyright">© 2024 墨点</span>
  </div>
</footer>
```

### 2. 移动应用

#### App图标
```css
.app-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 8px;
  box-shadow: 
    0 2px 8px rgba(0,0,0,0.1),
    0 1px 2px rgba(0,0,0,0.08);
}
```

#### 启动页
```html
<div class="splash-screen">
  <div class="splash-logo">
    <svg class="logo logo-xl animate-birth"><!-- SVG内容 --></svg>
    <h2 class="splash-title">墨点</h2>
    <p class="splash-subtitle">一点开始，无限可能</p>
  </div>
</div>
```

### 3. 印刷应用

#### 名片
```
尺寸: 85×54mm
Logo位置: 右上角
Logo尺寸: 12×12mm
工艺: 烫金/UV印刷
```

#### 宣传册
```
封面Logo: 40×40mm，居中
内页Logo: 15×15mm，页眉位置
背景Logo: 大尺寸水印，透明度20%
```

### 4. 数字媒体

#### 社交媒体头像
```
微信公众号: 200×200px
微博头像: 180×180px
知乎头像: 200×200px
建议使用简化版本，保证在小尺寸下的识别度
```

#### 视频水印
```
位置: 右下角
尺寸: 64×64px
透明度: 70%
动画: 淡入淡出
```

---

## 动画效果

### 1. 启动动画 "星云诞生"
```css
@keyframes nebulaBirth {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  25% {
    transform: scale(0.3) rotate(90deg);
    opacity: 0.3;
  }
  50% {
    transform: scale(0.7) rotate(180deg);
    opacity: 0.7;
  }
  75% {
    transform: scale(1.1) rotate(270deg);
    opacity: 0.9;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

.animate-birth {
  animation: nebulaBirth 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 2. 悬停动画 "星云脉动"
```css
@keyframes nebulaPulse {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.08);
    filter: brightness(1.2);
  }
}

.logo:hover {
  animation: nebulaPulse 2s ease-in-out infinite;
}
```

### 3. 加载动画 "星云旋转"
```css
@keyframes nebulaRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-loading {
  animation: nebulaRotate 2s linear infinite;
}

/* 墨点闪烁 */
@keyframes dotFlicker {
  0%, 90%, 100% { opacity: 1; }
  45%, 55% { opacity: 0.4; }
}

.animate-loading #dots circle:nth-child(odd) {
  animation: dotFlicker 1.5s ease-in-out infinite;
}

.animate-loading #dots circle:nth-child(even) {
  animation: dotFlicker 1.5s ease-in-out infinite 0.75s;
}
```

### 4. 交互动画 "星云扩散"
```css
@keyframes nebulaExpand {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1.2);
  }
}

.logo:active {
  animation: nebulaExpand 0.3s ease-out;
}
```

### 5. 连接线发光效果
```css
@keyframes lineGlow {
  0%, 100% {
    stroke-width: 2px;
    filter: drop-shadow(0 0 0 transparent);
  }
  50% {
    stroke-width: 3px;
    filter: drop-shadow(0 0 8px #00FFFF);
  }
}

.animate-glow #connections line {
  animation: lineGlow 3s ease-in-out infinite;
}
```

---

## 文件资源

### SVG文件
```
logo-standard.svg         - 标准版本 (120×120px)
logo-large.svg           - 大尺寸版本 (200×200px)
logo-medium.svg          - 中尺寸版本 (80×80px)
logo-small.svg           - 小尺寸版本 (48×48px)
logo-monochrome.svg      - 单色版本
logo-outline.svg         - 线条版本
```

### PNG文件
```
logo-standard.png        - 标准版本 (透明背景)
logo-standard-white.png  - 白色背景版本
logo-large.png          - 高清大图 (400×400px)
logo-favicon.png        - 网站图标 (32×32px)
```

### 印刷文件
```
logo-cmyk.ai            - Adobe Illustrator矢量文件
logo-pantone.eps        - 专色版本
logo-print.pdf          - 印刷用PDF
```

### 代码文件
```
logo-component.vue      - Vue组件
logo-component.react.js - React组件
logo-styles.css         - 完整CSS样式
logo-animations.css     - 动画效果CSS
```

---

## 使用规范

### ✅ 正确使用

1. **保持完整性**
   - 始终使用完整的Logo，不得分离元素
   - 保持所有墨点和连接线的相对位置

2. **尺寸要求**
   - 最小使用尺寸不得小于32×32px
   - 保持Logo的宽高比为1:1

3. **颜色使用**
   - 优先使用标准色彩方案
   - 确保足够的对比度

4. **留白空间**
   - Logo周围至少保留Logo高度1/4的留白
   - 不在留白区域放置其他元素

### ❌ 禁止使用

1. **变形操作**
   - 禁止拉伸、压缩或倾斜Logo
   - 禁止改变宽高比

2. **颜色修改**
   - 禁止随意更改Logo颜色
   - 禁止使用渐变色彩（除预定义渐变）

3. **元素修改**
   - 禁止增减墨点数量
   - 禁止改变连接线样式
   - 禁止添加阴影、描边等效果

4. **背景使用**
   - 禁止在复杂背景上使用Logo
   - 禁止使用对比度不足的背景

### 特殊情况处理

#### 黑色背景
```css
/* 使用反色版本 */
.logo-inverse {
  filter: invert(1);
}

/* 或使用白色描边版本 */
.logo-outline-white {
  stroke: #ffffff;
  fill: none;
}
```

#### 极小尺寸
```css
/* 简化到5个点 */
.logo-simplified {
  /* 只显示中心点和上下左右4个点 */
}
```

#### 单色印刷
```css
/* 使用纯黑版本 */
.logo-black {
  fill: #000000;
  stroke: #000000;
}
```

---

## 维护更新

### 版本管理
- 主版本: 重大设计变更
- 次版本: 细节优化调整
- 修订版本: 技术修复更新

### 文档更新
本文档将根据品牌发展和应用需求持续更新，请关注最新版本。

### 联系方式
如有Logo使用相关问题，请联系设计团队：
- **技术支持**：linhuinan542@gmail.com
- **项目Issues**：[GitHub Issues](https://github.com/pump12329/inkdot/issues)

---