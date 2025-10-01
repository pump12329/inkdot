#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';

/**
 * 快速UI测试 - 用于pre-commit hook
 * 检查基本的前端构建是否正常，不需要开发服务器
 */
async function quickUITest() {
  console.log('🎭 Running quick UI test...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // 监听控制台消息
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });

    // 监听页面错误
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });

    // 检查是否有构建文件
    const distExists = fs.existsSync('dist');
    if (!distExists) {
      console.log('⚠️  No dist folder found, running build first...');

      // 尝试运行构建
      try {
        const { execSync } = await import('child_process');
        execSync('npm run build', { stdio: 'pipe', timeout: 60000 });
        console.log('✅ Build completed successfully');
      } catch (buildError) {
        console.log('❌ Build failed, skipping UI tests');
        return false;
      }
    }

    // 尝试启动预览服务器
    let previewServer;
    try {
      const { spawn } = await import('child_process');
      previewServer = spawn('npm', ['run', 'preview'], {
        stdio: 'pipe',
        detached: true
      });

      // 等待预览服务器启动
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('🌐 Accessing preview server...');

      // 访问预览页面
      await page.goto('http://localhost:4173', {
        waitUntil: 'networkidle',
        timeout: 10000
      });

      // 检查页面是否正常加载
      const content = await page.content();
      const hasContent = content.length > 1000;

      if (!hasContent) {
        console.log('❌ Page content too short');
        return false;
      }

      // 检查是否有Vue应用
      const hasVueApp = await page.evaluate(() => {
        return document.querySelector('#app') !== null;
      });

      if (!hasVueApp) {
        console.log('❌ Vue app not found');
        return false;
      }

      // 检查是否有严重错误
      const criticalErrors = pageErrors.filter(
        error =>
          error.message.includes('TypeError') ||
          error.message.includes('ReferenceError') ||
          error.message.includes('SyntaxError')
      );

      if (criticalErrors.length > 0) {
        console.log('⚠️  Critical JavaScript errors found:');
        criticalErrors.forEach(error => {
          console.log(`   - ${error.message}`);
        });
        return false;
      }

      // 快速截图
      const screenshotsDir = 'tools/screenshots';
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      await page.screenshot({
        path: 'tools/screenshots/quick-ui-test.png',
        fullPage: true
      });

      console.log('✅ Quick UI test passed');
      console.log(`   - Page content: ${content.length} chars`);
      console.log(`   - Vue app: ${hasVueApp ? 'found' : 'not found'}`);
      console.log(`   - Console logs: ${consoleLogs.length}`);
      console.log(`   - Errors: ${pageErrors.length}`);
      console.log('   - Screenshot saved');

      return true;
    } catch (error) {
      console.log('❌ UI test failed:', error.message);
      return false;
    } finally {
      // 清理预览服务器
      if (previewServer) {
        try {
          process.kill(-previewServer.pid);
        } catch (e) {
          // 忽略清理错误
        }
      }
      await context.close();
    }
  } catch (error) {
    console.log('❌ Quick UI test setup failed:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  quickUITest()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Quick UI test error:', error);
      process.exit(1);
    });
}

export { quickUITest };
