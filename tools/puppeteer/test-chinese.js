const puppeteer = require('puppeteer');

async function testChineseSupport() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--lang=zh-CN',
      '--font-render-hinting=none',
      '--disable-font-subpixel-positioning',
      '--disable-remote-fonts'
    ]
  });

  const page = await browser.newPage();

  // 设置中文字体支持
  await page.evaluateOnNewDocument(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
      }
    `;
    document.head.appendChild(style);
  });

  // 设置页面语言
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  });

  // 监听控制台消息
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  try {
    console.log('正在访问 http://localhost:3001...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle0',
      timeout: 10000
    });

    console.log('页面加载完成，等待Vue应用启动...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 测试中文文本显示
    console.log('\n=== 测试中文文本显示 ===');
    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('页面中文内容:');
    console.log(pageText);

    // 检查中文字符是否正确显示
    const hasChinese = /[\u4e00-\u9fff]/.test(pageText);
    console.log(`是否包含中文字符: ${hasChinese}`);

    // 测试添加示例数据
    console.log('\n=== 测试添加中文示例数据 ===');
    const sampleBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('示例'));
    });

    if (sampleBtn.asElement()) {
      await sampleBtn.asElement().click();
      console.log('点击了示例按钮');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 检查示例数据中的中文
    const sampleText = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('示例数据中文内容:');
    console.log(sampleText);

    // 测试中文输入
    console.log('\n=== 测试中文输入 ===');
    const nodes = await page.$$('.outline-item');
    if (nodes.length > 0) {
      const firstNode = nodes[0];
      await firstNode.click();
      console.log('点击了第一个节点');

      // 双击进入编辑模式
      await firstNode.click({ clickCount: 2 });
      console.log('双击了第一个节点');
      await new Promise(resolve => setTimeout(resolve, 500));

      // 检查是否有输入框
      const input = await page.$('.node-input');
      if (input) {
        console.log('找到输入框，测试中文输入');
        await input.type('测试中文输入：你好世界！');
        await page.keyboard.press('Enter');
        console.log('中文输入完成并保存');
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log('未找到输入框');
      }
    }

    // 获取最终页面内容
    const finalText = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('\n=== 最终中文内容 ===');
    console.log(finalText);

    // 截图
    await page.screenshot({
      fullPage: true,
      path: '../screenshots/chinese-test-screenshot.png'
    });
    console.log('中文测试截图已保存为 tools/screenshots/chinese-test-screenshot.png');

    // 检查字体渲染
    const fontInfo = await page.evaluate(() => {
      const element = document.querySelector('.title');
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        return {
          fontFamily: computedStyle.fontFamily,
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight
        };
      }
      return null;
    });

    console.log('\n=== 字体信息 ===');
    console.log(fontInfo);
  } catch (error) {
    console.log('测试过程中出错:', error.message);
  } finally {
    await browser.close();
  }
}

testChineseSupport().catch(console.error);
