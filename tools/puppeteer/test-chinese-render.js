const puppeteer = require('puppeteer');

async function testChineseRender() {
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
      '--disable-remote-fonts',
      '--force-device-scale-factor=1',
      '--disable-extensions',
      '--disable-plugins'
    ]
  });

  const page = await browser.newPage();

  // 设置中文字体支持
  await page.evaluateOnNewDocument(() => {
    const addChineseFonts = () => {
      const style = document.createElement('style');
      style.id = 'chinese-fonts';
      style.textContent = `
        /* 强制中文字体渲染 - 使用系统安装的字体 */
        * {
          font-family: 
            'Noto Sans CJK SC', 
            'Noto Sans CJK TC', 
            'WenQuanYi Micro Hei', 
            'WenQuanYi Zen Hei', 
            'PingFang SC', 
            'Hiragino Sans GB', 
            'Microsoft YaHei', 
            'Source Han Sans SC', 
            -apple-system, 
            BlinkMacSystemFont, 
            'Segoe UI', 
            'Helvetica Neue', 
            Helvetica, 
            Arial, 
            sans-serif !important;
        }
        
        body, html {
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-size: 14px;
          line-height: 1.5;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
          font-weight: 600;
        }
        
        button {
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
        }
        
        input, textarea {
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
        }
      `;

      if (document.head) {
        document.head.appendChild(style);
      } else {
        document.documentElement.appendChild(style);
      }
    };

    addChineseFonts();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addChineseFonts);
    }
  });

  // 设置页面语言
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  });

  // 设置视口
  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1
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
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 强制应用中文字体
    await page.evaluate(() => {
      // 移除所有现有字体样式
      const existingStyles = document.querySelectorAll('style[id*="chinese"], style[id*="font"]');
      existingStyles.forEach(style => style.remove());

      // 添加强制中文字体样式
      const style = document.createElement('style');
      style.id = 'force-chinese-fonts';
      style.textContent = `
        /* 强制中文字体渲染 - 使用系统安装的字体 */
        * {
          font-family: 
            'Noto Sans CJK SC', 
            'Noto Sans CJK TC', 
            'WenQuanYi Micro Hei', 
            'WenQuanYi Zen Hei', 
            'PingFang SC', 
            'Hiragino Sans GB', 
            'Microsoft YaHei', 
            'Source Han Sans SC', 
            -apple-system, 
            BlinkMacSystemFont, 
            'Segoe UI', 
            'Helvetica Neue', 
            Helvetica, 
            Arial, 
            sans-serif !important;
        }
        
        body, html {
          font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `;

      document.head.appendChild(style);

      // 强制重新渲染所有元素
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.fontFamily = "'PingFang SC', 'Microsoft YaHei', sans-serif";
      });
    });

    console.log('\n=== 测试中文文本显示 ===');
    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('页面中文内容:');
    console.log(pageText);

    // 检查中文字符
    const hasChinese = /[\u4e00-\u9fff]/.test(pageText);
    console.log(`是否包含中文字符: ${hasChinese}`);

    // 检查字体渲染
    const fontInfo = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, button, .outline-item, .node-content');
      const fonts = [];

      elements.forEach((el, index) => {
        if (index < 5) {
          // 只检查前5个元素
          const computedStyle = window.getComputedStyle(el);
          fonts.push({
            tagName: el.tagName,
            text: el.textContent?.substring(0, 20) || '',
            fontFamily: computedStyle.fontFamily,
            fontSize: computedStyle.fontSize,
            fontWeight: computedStyle.fontWeight
          });
        }
      });

      return fonts;
    });

    console.log('\n=== 字体渲染信息 ===');
    fontInfo.forEach((info, index) => {
      console.log(`${index + 1}. ${info.tagName}: "${info.text}"`);
      console.log(`   字体: ${info.fontFamily}`);
      console.log(`   大小: ${info.fontSize}, 粗细: ${info.fontWeight}`);
    });

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

      // 再次检查字体
      const sampleFontInfo = await page.evaluate(() => {
        const elements = document.querySelectorAll('.outline-item, .node-content');
        const fonts = [];

        elements.forEach((el, index) => {
          if (index < 3) {
            const computedStyle = window.getComputedStyle(el);
            fonts.push({
              text: el.textContent?.substring(0, 20) || '',
              fontFamily: computedStyle.fontFamily,
              fontSize: computedStyle.fontSize
            });
          }
        });

        return fonts;
      });

      console.log('\n=== 示例数据字体信息 ===');
      sampleFontInfo.forEach((info, index) => {
        console.log(`${index + 1}. "${info.text}"`);
        console.log(`   字体: ${info.fontFamily}`);
        console.log(`   大小: ${info.fontSize}`);
      });
    }

    // 最终截图
    await page.screenshot({
      fullPage: true,
      path: '../screenshots/chinese-render-test.png'
    });
    console.log('\n中文渲染测试截图已保存为 tools/screenshots/chinese-render-test.png');
  } catch (error) {
    console.log('测试过程中出错:', error.message);
  } finally {
    await browser.close();
  }
}

testChineseRender().catch(console.error);
