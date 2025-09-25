const puppeteer = require('puppeteer');

async function testButtons() {
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

    // 测试添加示例按钮
    console.log('\n=== 测试添加示例按钮 ===');
    const sampleBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('示例'));
    });

    if (sampleBtn.asElement()) {
      await sampleBtn.asElement().click();
      console.log('点击了示例按钮');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log('未找到示例按钮');
    }

    // 检查是否有节点添加
    const nodes = await page.$$('.outline-item');
    console.log(`当前节点数量: ${nodes.length}`);

    // 测试添加根节点按钮
    console.log('\n=== 测试添加根节点按钮 ===');
    const addBtn = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('新建'));
    });

    if (addBtn.asElement()) {
      await addBtn.asElement().click();
      console.log('点击了新建按钮');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log('未找到新建按钮');
    }

    // 再次检查节点数量
    const nodesAfter = await page.$$('.outline-item');
    console.log(`添加后节点数量: ${nodesAfter.length}`);

    // 测试编辑功能
    if (nodesAfter.length > 0) {
      console.log('\n=== 测试编辑功能 ===');
      const firstNode = nodesAfter[0];
      await firstNode.click();
      console.log('点击了第一个节点');

      // 双击进入编辑模式
      await firstNode.click({ clickCount: 2 });
      console.log('双击了第一个节点');
      await new Promise(resolve => setTimeout(resolve, 500));

      // 检查是否有输入框
      const input = await page.$('.node-input');
      if (input) {
        console.log('找到输入框，测试输入');
        await input.type('测试内容');
        await page.keyboard.press('Enter');
        console.log('输入完成并保存');
      } else {
        console.log('未找到输入框');
      }
    }

    // 获取最终页面内容
    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('\n=== 最终页面内容 ===');
    console.log(pageText);

    // 截图
    await page.screenshot({
      fullPage: true,
      path: '../screenshots/test-buttons-screenshot.png'
    });
    console.log('截图已保存为 tools/screenshots/test-buttons-screenshot.png');
  } catch (error) {
    console.log('测试过程中出错:', error.message);
  } finally {
    await browser.close();
  }
}

testButtons().catch(console.error);
