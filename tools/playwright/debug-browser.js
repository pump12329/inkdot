import fs from 'fs';
import { createChineseBrowser } from './playwright-chinese-config.js';

async function debugBrowser(options = {}) {
  const { quick = false, port = 3003 } = options;
  const { browser, _context, page } = await createChineseBrowser();

  // 监听控制台消息
  const consoleLogs = [];
  page.on('console', msg => {
    const log = {
      type: msg.type(),
      text: msg.text(),
      timestamp: new Date().toISOString()
    };
    consoleLogs.push(log);
    console.log(`[${log.type.toUpperCase()}] ${log.text}`);
  });

  // 监听页面错误
  const pageErrors = [];
  page.on('pageerror', error => {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    pageErrors.push(errorLog);
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  // 监听网络错误
  const networkErrors = [];
  page.on('requestfailed', request => {
    const networkError = {
      url: request.url(),
      error: request.failure().errorText,
      timestamp: new Date().toISOString()
    };
    networkErrors.push(networkError);
    console.log(`[NETWORK ERROR] ${request.url()} - ${request.failure().errorText}`);
  });

  try {
    const url = `http://localhost:${port}`;
    console.log(`正在访问 ${url}...`);

    // 访问页面
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: quick ? 5000 : 10000
    });

    console.log('页面加载完成，等待Vue应用启动...');

    // 等待Vue应用启动
    await page.waitForTimeout(quick ? 1000 : 3000);

    // 检查页面内容
    const content = await page.content();
    console.log('页面内容长度:', content.length);

    // 检查是否有Vue应用内容
    const hasVueContent = await page.evaluate(() => {
      const app = document.querySelector('#app');
      return app && app.innerHTML.trim().length > 0;
    });

    console.log('Vue应用是否显示内容:', hasVueContent);

    // 获取页面文本内容
    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('页面文本内容:');
    console.log(pageText);

    // 截图
    console.log('正在截图...');
    const screenshotPath = quick
      ? 'tools/screenshots/quick-debug-screenshot.png'
      : 'tools/screenshots/debug-screenshot.png';
    await page.screenshot({
      fullPage: true,
      path: screenshotPath
    });
    console.log(`截图已保存为 ${screenshotPath}`);

    // 保存控制台日志（只在非快速模式下）
    if (!quick) {
      const debugInfo = {
        timestamp: new Date().toISOString(),
        url: `http://localhost:${port}`,
        consoleLogs,
        pageErrors,
        networkErrors,
        pageText,
        hasVueContent,
        contentLength: content.length
      };

      // 确保screenshots目录存在
      const screenshotsDir = 'tools/screenshots';
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      fs.writeFileSync('tools/screenshots/debug-info.json', JSON.stringify(debugInfo, null, 2));
      console.log('调试信息已保存为 tools/screenshots/debug-info.json');
    }

    // 等待一下让页面完全加载
    await page.waitForTimeout(quick ? 500 : 2000);

    if (!quick) {
      console.log('正在截图...');
      await page.screenshot({
        path: 'tools/screenshots/debug-screenshot.png',
        fullPage: true
      });
      console.log('截图已保存为 tools/screenshots/debug-screenshot.png');
    }
  } catch (error) {
    console.log('访问页面时出错:', error.message);
    if (quick) {
      console.log('快速模式下出现错误是正常的，可能开发服务器未启动');
    }
  } finally {
    await browser.close();
  }
}

// 支持命令行参数
const args = process.argv.slice(2);
const options = {};

if (args.includes('--quick')) {
  options.quick = true;
}

if (args.includes('--port')) {
  const portIndex = args.indexOf('--port');
  if (portIndex !== -1 && args[portIndex + 1]) {
    options.port = parseInt(args[portIndex + 1]);
  }
}

debugBrowser(options).catch(console.error);
