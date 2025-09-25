# Puppeteer 测试工具

这个目录包含了用于测试和调试 InkDot 应用的 Puppeteer 脚本。

## 文件说明

### 核心配置文件

- `puppeteer-chinese-config.js` - 中文支持的 Puppeteer 配置
  - 提供中文字体支持
  - 配置浏览器参数
  - 设置页面语言环境

### 测试脚本

- `debug-browser.js` - 调试浏览器脚本
  - 捕获控制台日志
  - 检测页面错误
  - 生成调试报告和截图

- `test-buttons.js` - 按钮功能测试
  - 测试按钮点击功能
  - 验证交互逻辑
  - 测试编辑功能

- `test-chinese.js` - 中文支持测试
  - 验证中文字符显示
  - 测试中文输入
  - 检查字体渲染

- `test-chinese-render.js` - 中文渲染测试
  - 详细检查字体渲染效果
  - 验证系统字体使用情况
  - 生成渲染质量截图

- `check-fonts.js` - 字体检测工具
  - 检查系统可用字体
  - 测试各种中文字符渲染
  - 生成字体测试页面截图

## 使用方法

### 安装依赖

```bash
npm install puppeteer
```

### 运行测试

```bash
# 调试应用
node tools/puppeteer/debug-browser.js

# 测试按钮功能
node tools/puppeteer/test-buttons.js

# 测试中文支持
node tools/puppeteer/test-chinese.js

# 测试中文渲染
node tools/puppeteer/test-chinese-render.js

# 检查字体可用性
node tools/puppeteer/check-fonts.js

# 使用便捷命令
npm run test:puppeteer:all
npm run test:puppeteer:render
npm run test:puppeteer:chinese
```

### 配置说明

#### 中文支持配置

- 设置浏览器语言为 `zh-CN`
- 配置中文字体回退链
- 优化字体渲染参数

#### 浏览器参数

- `--no-sandbox` - 禁用沙箱（Linux 环境必需）
- `--disable-setuid-sandbox` - 禁用 setuid 沙箱
- `--lang=zh-CN` - 设置语言为中文
- `--font-render-hinting=none` - 优化字体渲染

## 输出文件

测试运行后会生成以下文件（保存在 `tools/screenshots/` 目录）：

- `debug-screenshot.png` - 调试截图
- `debug-info.json` - 调试信息
- `test-buttons-screenshot.png` - 按钮测试截图
- `chinese-test-screenshot.png` - 中文测试截图
- `chinese-render-test.png` - 中文渲染测试截图
- `font-test-screenshot.png` - 字体测试截图

## 中文字体支持

### 系统字体安装

```bash
# Ubuntu/Debian 系统
sudo apt-get update
sudo apt-get install -y fonts-noto-cjk fonts-wqy-zenhei fonts-wqy-microhei

# 验证字体安装
fc-list :lang=zh
```

### Docker 支持

```bash
# 使用预配置的中文支持镜像
docker-compose -f tools/puppeteer/docker-compose.chinese.yml up

# 构建中文支持镜像
docker build -f tools/puppeteer/Dockerfile.chinese -t inkdot-chinese .
```

### 字体优先级

1. **Noto Sans CJK SC** - 简体中文首选
2. **WenQuanYi Micro Hei** - 文泉驿微米黑
3. **WenQuanYi Zen Hei** - 文泉驿正黑
4. **PingFang SC** - 苹果系统字体
5. **Microsoft YaHei** - 微软雅黑

## 注意事项

1. 确保应用在 `http://localhost:3001` 运行
2. 测试前需要先启动开发服务器
3. 截图和日志文件会保存在项目根目录
4. 如果遇到权限问题，可能需要调整浏览器参数
5. **重要**：确保系统已安装中文字体，否则会出现乱码
