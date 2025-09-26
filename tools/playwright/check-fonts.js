import { createChineseBrowser } from './playwright-chinese-config.js';

async function checkFonts() {
  const { browser, context, page } = await createChineseBrowser();

  try {
    console.log('🔍 检查系统可用字体...');

    // 检查字体是否可用
    const fontCheck = await page.evaluate(() => {
      const testText = '中文测试字体渲染效果';
      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.style.fontSize = '20px';
      testElement.textContent = testText;
      document.body.appendChild(testElement);

      const fonts = [
        'Noto Sans CJK SC',
        'Noto Sans CJK TC',
        'WenQuanYi Micro Hei',
        'WenQuanYi Zen Hei',
        'PingFang SC',
        'Hiragino Sans GB',
        'Microsoft YaHei',
        'Source Han Sans SC',
        'SimSun',
        'SimHei'
      ];

      const results = [];

      fonts.forEach(font => {
        testElement.style.fontFamily = font;
        const computedStyle = window.getComputedStyle(testElement);
        const actualFont = computedStyle.fontFamily;

        results.push({
          font: font,
          available: actualFont.includes(font),
          actualFont: actualFont,
          width: testElement.offsetWidth,
          height: testElement.offsetHeight
        });
      });

      document.body.removeChild(testElement);
      return results;
    });

    console.log('\n📊 字体可用性检查结果:');
    console.log('='.repeat(60));

    fontCheck.forEach((result, index) => {
      const status = result.available ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.font}`);
      if (!result.available) {
        console.log(`   实际字体: ${result.actualFont}`);
      }
      console.log(`   尺寸: ${result.width}x${result.height}px`);
    });

    // 检查中文字符渲染
    console.log('\n🔤 中文字符渲染测试:');
    console.log('='.repeat(60));

    const renderTest = await page.evaluate(() => {
      const testChars = [
        '中文简体',
        '中文繁體',
        '日本語',
        '한국어',
        'English',
        '123456',
        '！@#￥%……&*（）',
        '【】《》「」『』'
      ];

      const testElement = document.createElement('div');
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.style.fontSize = '20px';
      testElement.style.fontFamily = 'Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif';
      document.body.appendChild(testElement);

      const results = testChars.map(char => {
        testElement.textContent = char;
        const computedStyle = window.getComputedStyle(testElement);
        return {
          char: char,
          font: computedStyle.fontFamily,
          width: testElement.offsetWidth,
          height: testElement.offsetHeight
        };
      });

      document.body.removeChild(testElement);
      return results;
    });

    renderTest.forEach((result, index) => {
      console.log(`${index + 1}. "${result.char}"`);
      console.log(`   字体: ${result.font}`);
      console.log(`   尺寸: ${result.width}x${result.height}px`);
    });

    // 生成测试页面截图
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>中文字体测试</title>
        <style>
          body {
            font-family: 'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            padding: 20px;
            background: #f5f5f5;
          }
          .test-section {
            background: white;
            padding: 20px;
            margin: 10px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .font-test {
            font-size: 24px;
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .chinese-text {
            font-size: 18px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>中文字体渲染测试</h1>

        <div class="test-section">
          <h2>基础中文字体测试</h2>
          <div class="font-test" style="font-family: 'Noto Sans CJK SC', sans-serif;">
            Noto Sans CJK SC: 这是简体中文测试文本
          </div>
          <div class="font-test" style="font-family: 'WenQuanYi Micro Hei', sans-serif;">
            WenQuanYi Micro Hei: 这是文泉驿微米黑字体测试
          </div>
          <div class="font-test" style="font-family: 'WenQuanYi Zen Hei', sans-serif;">
            WenQuanYi Zen Hei: 这是文泉驿正黑字体测试
          </div>
        </div>

        <div class="test-section">
          <h2>各种中文字符测试</h2>
          <div class="chinese-text">
            <p>简体中文：你好世界！这是一个测试页面。</p>
            <p>繁體中文：你好世界！這是一個測試頁面。</p>
            <p>日文：こんにちは世界！これはテストページです。</p>
            <p>韩文：안녕하세요 세계! 이것은 테스트 페이지입니다.</p>
            <p>标点符号：，。！？；：""''（）【】《》「」『』</p>
            <p>数字和符号：0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
          </div>
        </div>

        <div class="test-section">
          <h2>字体大小测试</h2>
          <div style="font-size: 12px;">12px: 小号字体测试</div>
          <div style="font-size: 14px;">14px: 标准字体测试</div>
          <div style="font-size: 16px;">16px: 中等字体测试</div>
          <div style="font-size: 18px;">18px: 大号字体测试</div>
          <div style="font-size: 24px;">24px: 标题字体测试</div>
          <div style="font-size: 32px;">32px: 超大字体测试</div>
        </div>
      </body>
      </html>
    `);

    await page.screenshot({
      fullPage: true,
      path: 'tools/screenshots/font-test-screenshot.png'
    });

    console.log('\n📸 字体测试截图已保存为 tools/screenshots/font-test-screenshot.png');
  } catch (error) {
    console.error('字体检查过程中出错:', error.message);
  } finally {
    await browser.close();
  }
}

checkFonts().catch(console.error);
