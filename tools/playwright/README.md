# Playwright 测试工具

这个目录包含了用于测试和调试 InkDot 应用的 Playwright 脚本。Playwright 是 Puppeteer 的现代化替代方案，提供更好的性能和跨浏览器支持。

## 文件说明

### 核心配置文件

- `playwright-chinese-config.js` - 中文支持的 Playwright 配置
  - 提供中文字体支持
  - 配置浏览器参数
  - 设置页面语言环境
  - 统一的浏览器实例创建

### 测试脚本

- `debug-browser.js` - 调试浏览器脚本
  - 捕获控制台日志
  - 检测页面错误
  - 生成调试报告和截图

- `test-buttons.js` - 按钮功能测试
  - 测试按钮点击功能
  - 验证交互逻辑
  - 测试编辑功能
  - 测试拖拽功能

- `test-chinese.js` - 中文支持测试
  - 验证中文字符显示
  - 测试中文输入
  - 检查字体渲染
  - 特殊中文字符测试

- `test-chinese-render.js` - 中文渲染测试
  - 详细检查字体渲染效果
  - 验证系统字体使用情况
  - 生成渲染质量截图
  - 字体回退机制测试

- `check-fonts.js` - 字体检测工具
  - 检查系统可用字体
  - 测试各种中文字符渲染
  - 生成字体测试页面截图

### 运行脚本

- `run-tests.js` - 统一的测试运行器
  - 支持运行单个或所有测试
  - 环境检查和依赖验证
  - 详细的帮助信息

## Playwright vs Puppeteer

### 主要优势

- **更好的性能**: Playwright 启动更快，内存占用更少
- **跨浏览器支持**: 支持 Chromium, Firefox, Safari
- **自动等待**: 内置智能等待机制，无需手动 `waitForTimeout`
- **更好的调试**: 内置调试工具和追踪功能
- **现代 API**: 更简洁、更直观的 API 设计

### API 对比

| 功能     | Puppeteer                | Playwright          |
| -------- | ------------------------ | ------------------- |
| 页面导航 | `page.goto()`            | `page.goto()`       |
| 元素选择 | `page.$()`               | `page.locator()`    |
| 点击     | `element.click()`        | `locator.click()`   |
| 等待     | `page.waitForSelector()` | `locator.waitFor()` |
| 截图     | `page.screenshot()`      | `page.screenshot()` |

## 使用方法

### 安装依赖

```bash
npm install --save-dev @playwright/test playwright
```

### 安装浏览器

```bash
npx playwright install
```

### 运行测试

```bash
# 调试应用
node tools/playwright/debug-browser.js

# 测试按钮功能
node tools/playwright/test-buttons.js

# 测试中文支持
node tools/playwright/test-chinese.js

# 测试中文渲染
node tools/playwright/test-chinese-render.js

# 检查字体可用性
node tools/playwright/check-fonts.js

# 使用便捷命令
npm run test:playwright:all
npm run test:playwright:render
npm run test:playwright:chinese
npm run test:playwright:fonts
```

### 使用运行器

```bash
# 运行所有测试
npm run test:playwright:all

# 运行特定测试
npm run test:playwright:debug
npm run test:playwright:buttons
npm run test:playwright:chinese
npm run test:playwright:render
npm run test:playwright:fonts

# 显示帮助
node tools/playwright/run-tests.js help
```

## 配置说明

### 中文支持配置

- 设置浏览器语言为 `zh-CN`
- 配置中文字体回退链
- 优化字体渲染参数
- 自动注入中文字体样式

### 浏览器参数

- `--no-sandbox` - 禁用沙箱（Linux 环境必需）
- `--disable-setuid-sandbox` - 禁用 setuid 沙箱
- `--lang=zh-CN` - 设置语言为中文
- `--font-render-hinting=none` - 优化字体渲染

### 推荐字体链

```css
font-family:
  'Noto Sans CJK SC', 'WenQuanYi Micro Hei', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

## Docker 支持

### 构建镜像

```bash
cd tools/playwright
docker build -f Dockerfile.chinese -t inkdot-playwright ../../
```

### 使用 Docker Compose

```bash
# 启动开发环境
docker-compose -f docker-compose.chinese.yml up

# 运行测试
docker-compose -f docker-compose.chinese.yml --profile testing up playwright-tests
```

## 输出文件

测试运行后会生成以下文件（保存在 `tools/screenshots/` 目录）：

- `debug-screenshot.png` - 调试截图
- `debug-info.json` - 调试信息
- `button-test-screenshot.png` - 按钮测试截图
- `chinese-test-screenshot.png` - 中文测试截图
- `chinese-render-test.png` - 中文渲染测试截图
- `font-test-screenshot.png` - 字体测试截图

## 故障排除

### 常见问题

1. **浏览器启动失败**

   ```bash
   # 安装系统依赖
   npx playwright install-deps
   ```

2. **中文字体显示异常**

   ```bash
   # 安装中文字体包（Ubuntu/Debian）
   sudo apt-get install fonts-noto-cjk fonts-wqy-zenhei
   ```

3. **权限问题**
   ```bash
   # 添加用户到相应组
   sudo usermod -a -G audio,video $USER
   ```

### 调试技巧

1. **启用调试模式**

   ```javascript
   const { browser, context, page } = await createChineseBrowser();
   // 将 headless 设置为 false 来查看浏览器
   ```

2. **使用 Playwright Inspector**

   ```bash
   PWDEBUG=1 node tools/playwright/test-buttons.js
   ```

3. **生成追踪文件**
   ```javascript
   await context.tracing.start({ screenshots: true, snapshots: true });
   // ... 测试代码 ...
   await context.tracing.stop({ path: 'trace.zip' });
   ```

## 环境要求

- Node.js >= 18.0.0
- Playwright >= 1.40.0
- 系统中文字体支持
- 足够的磁盘空间用于浏览器安装

## 性能优化

- 使用无头模式降低资源消耗
- 合理设置超时时间
- 复用浏览器实例
- 及时关闭页面和上下文

## 贡献指南

1. 遵循现有的代码风格
2. 添加适当的错误处理
3. 更新相关文档
4. 提供测试用例
