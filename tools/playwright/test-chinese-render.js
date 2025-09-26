import { createChineseBrowser, forceChineseFont } from './playwright-chinese-config.js';

async function testChineseRender() {
  const { browser, context, page } = await createChineseBrowser();

  // 监听控制台消息
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  try {
    console.log('正在访问 http://localhost:3000...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('页面加载完成，等待Vue应用启动...');
    await page.waitForTimeout(3000);

    // 强制应用中文字体
    await forceChineseFont(page);

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

    // 查找示例按钮
    const sampleButton = page
      .locator('button')
      .filter({ hasText: /示例|样例|例子/ })
      .first();
    const buttonExists = (await sampleButton.count()) > 0;

    if (buttonExists) {
      const isVisible = await sampleButton.isVisible();
      const isEnabled = await sampleButton.isEnabled();

      if (isVisible && isEnabled) {
        await sampleButton.click();
        console.log('点击了示例按钮');
        await page.waitForTimeout(2000);

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
      } else {
        console.log('示例按钮不可点击');
      }
    } else {
      console.log('未找到示例按钮');
    }

    console.log('\n=== 详细字体渲染测试 ===');

    // 测试不同类型的中文字符渲染
    const chineseTexts = [
      '简体中文：你好世界！',
      '繁體中文：你好世界！',
      '日文假名：ひらがな カタカナ',
      '韩文：안녕하세요',
      '标点符号：，。！？；：""\'\'（）【】《》「」『』',
      '数字混合：2024年1月1日 星期一',
      '特殊字符：①②③④⑤ ⒈⒉⒊⒋⒌ 甲乙丙丁戊',
      '英中混合：Hello 世界 World 测试 Test'
    ];

    for (const text of chineseTexts) {
      console.log(`\n测试文本: "${text}"`);

      const renderResult = await page.evaluate(testText => {
        // 创建测试元素
        const testElement = document.createElement('div');
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.fontSize = '16px';
        testElement.style.fontFamily = 'PingFang SC, Microsoft YaHei, sans-serif';
        testElement.style.lineHeight = '1.5';
        testElement.textContent = testText;

        document.body.appendChild(testElement);

        const computedStyle = window.getComputedStyle(testElement);
        const result = {
          text: testElement.textContent,
          fontFamily: computedStyle.fontFamily,
          fontSize: computedStyle.fontSize,
          width: testElement.offsetWidth,
          height: testElement.offsetHeight,
          rendered: testElement.offsetWidth > 0 && testElement.offsetHeight > 0
        };

        document.body.removeChild(testElement);
        return result;
      }, text);

      console.log(`  渲染状态: ${renderResult.rendered ? '✅' : '❌'}`);
      console.log(`  使用字体: ${renderResult.fontFamily}`);
      console.log(`  字体大小: ${renderResult.fontSize}`);
      console.log(`  元素尺寸: ${renderResult.width}x${renderResult.height}px`);
    }

    console.log('\n=== 字体回退测试 ===');

    // 测试字体回退机制
    const fontFallbackTest = await page.evaluate(() => {
      const testFonts = [
        'PingFang SC',
        'Microsoft YaHei',
        'Noto Sans CJK SC',
        'WenQuanYi Micro Hei',
        'Source Han Sans SC',
        'SimSun',
        'SimHei'
      ];

      const results = [];
      const testText = '中文字体测试';

      testFonts.forEach(font => {
        const testElement = document.createElement('div');
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.fontSize = '16px';
        testElement.style.fontFamily = font + ', sans-serif';
        testElement.textContent = testText;

        document.body.appendChild(testElement);

        const computedStyle = window.getComputedStyle(testElement);
        results.push({
          requestedFont: font,
          actualFont: computedStyle.fontFamily,
          width: testElement.offsetWidth,
          height: testElement.offsetHeight,
          available: computedStyle.fontFamily.includes(font)
        });

        document.body.removeChild(testElement);
      });

      return results;
    });

    fontFallbackTest.forEach((result, index) => {
      const status = result.available ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.requestedFont}`);
      console.log(`   实际字体: ${result.actualFont}`);
      console.log(`   尺寸: ${result.width}x${result.height}px`);
    });

    console.log('\n=== 字体大小响应性测试 ===');

    // 测试不同字体大小下的中文渲染
    const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px'];

    for (const fontSize of fontSizes) {
      const sizeResult = await page.evaluate(size => {
        const testElement = document.createElement('div');
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.fontSize = size;
        testElement.style.fontFamily = 'PingFang SC, Microsoft YaHei, sans-serif';
        testElement.textContent = '中文大小测试Aa';

        document.body.appendChild(testElement);

        const result = {
          size: size,
          width: testElement.offsetWidth,
          height: testElement.offsetHeight
        };

        document.body.removeChild(testElement);
        return result;
      }, fontSize);

      console.log(`${fontSize}: ${sizeResult.width}x${sizeResult.height}px`);
    }

    // 最终截图
    await page.screenshot({
      fullPage: true,
      path: 'tools/screenshots/chinese-render-test.png'
    });
    console.log('\n中文渲染测试截图已保存为 tools/screenshots/chinese-render-test.png');

    console.log('\n🎉 中文渲染测试完成!');
  } catch (error) {
    console.log('测试过程中出错:', error.message);
  } finally {
    await browser.close();
  }
}

testChineseRender().catch(console.error);
