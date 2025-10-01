const { createChineseBrowser, testChineseFont } = require('./playwright-chinese-config');

async function testChineseSupport() {
  const { browser, _context, page } = await createChineseBrowser();

  // 监听控制台消息
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  try {
    console.log('正在访问 http://localhost:3001...');

    // 访问页面
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('页面加载完成，等待Vue应用启动...');

    // 等待Vue应用启动
    await page.waitForTimeout(3000);

    console.log('\n=== 测试中文字体支持 ===');

    // 测试中文字体
    const _fontTestResult = await testChineseFont(page);

    console.log('\n=== 检查页面中文内容 ===');

    // 获取页面文本内容
    const pageText = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('页面文本内容:');
    console.log(pageText.substring(0, 500) + '...');

    // 检查中文字符
    const hasChinese = /[\u4e00-\u9fff]/.test(pageText);
    const hasTraditionalChinese =
      /[\u4e00-\u9fff]/.test(pageText) && /繁|體|臺|園|國|學/.test(pageText);

    console.log(`\n📊 中文字符检测结果:`);
    console.log(`  包含中文字符: ${hasChinese ? '✅' : '❌'}`);
    console.log(`  包含繁体字符: ${hasTraditionalChinese ? '✅' : '❌'}`);
    console.log(`  文本总长度: ${pageText.length}`);

    console.log('\n=== 测试中文输入 ===');

    // 查找输入框进行中文输入测试
    const inputs = await page.locator('input, textarea').all();

    if (inputs.length > 0) {
      const input = inputs[0];
      const isVisible = await input.isVisible();
      const isEnabled = await input.isEnabled();

      if (isVisible && isEnabled) {
        console.log('找到可用输入框，开始测试中文输入...');

        const testTexts = [
          '简体中文测试',
          '繁體中文測試',
          '中英混合 Mixed Content',
          '标点符号：，。！？；：""\'\'（）【】《》',
          '数字混合：2024年1月1日'
        ];

        for (let i = 0; i < testTexts.length; i++) {
          const testText = testTexts[i];
          console.log(`\n测试文本 ${i + 1}: "${testText}"`);

          try {
            // 清空输入框
            await input.fill('');
            await page.waitForTimeout(200);

            // 输入中文文本
            await input.fill(testText);
            await page.waitForTimeout(500);

            // 验证输入
            const inputValue = await input.inputValue();
            const inputSuccess = inputValue === testText;

            console.log(`  输入结果: "${inputValue}"`);
            console.log(`  输入成功: ${inputSuccess ? '✅' : '❌'}`);

            if (!inputSuccess) {
              console.log(`  预期: "${testText}"`);
              console.log(`  实际: "${inputValue}"`);
            }
          } catch (error) {
            console.log(`  ❌ 输入测试失败: ${error.message}`);
          }
        }
      } else {
        console.log('❌ 没有找到可用的输入框');
      }
    } else {
      console.log('❌ 页面中没有输入框');
    }

    console.log('\n=== 测试中文显示元素 ===');

    // 检查各种元素的中文显示
    const elementSelectors = ['h1, h2, h3, h4, h5, h6', 'button', 'p', 'div', 'span', 'li'];

    for (const selector of elementSelectors) {
      try {
        const elements = await page.locator(selector).all();
        let chineseElementCount = 0;

        for (const element of elements.slice(0, 5)) {
          // 只检查前5个元素
          const text = await element.textContent();
          if (text && /[\u4e00-\u9fff]/.test(text)) {
            chineseElementCount++;

            // 获取字体信息
            const fontInfo = await element.evaluate(el => {
              const style = window.getComputedStyle(el);
              return {
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight
              };
            });

            console.log(`  ${selector.split(',')[0]}: "${text.substring(0, 20)}..."`);
            console.log(`    字体: ${fontInfo.fontFamily}`);
            console.log(`    大小: ${fontInfo.fontSize}, 粗细: ${fontInfo.fontWeight}`);
            break; // 只显示第一个中文元素的信息
          }
        }

        if (chineseElementCount > 0) {
          console.log(`${selector}: 找到 ${chineseElementCount} 个中文元素 ✅`);
        } else {
          console.log(`${selector}: 未找到中文元素 ❌`);
        }
      } catch (error) {
        console.log(`${selector}: 检测失败 - ${error.message}`);
      }
    }

    console.log('\n=== 测试特殊中文字符 ===');

    // 测试特殊中文字符的渲染
    const specialChars = [
      '㍿',
      '㎡',
      '㎜',
      '㎝',
      '㎞', // 特殊符号
      '①②③④⑤⑥⑦⑧⑨⑩', // 圆圈数字
      '⒈⒉⒊⒋⒌⒍⒎⒏⒐⒑', // 括号数字
      '壹贰叁肆伍陆柒捌玖拾', // 大写数字
      '甲乙丙丁戊己庚辛壬癸' // 天干
    ];

    for (const chars of specialChars) {
      console.log(`测试特殊字符: ${chars}`);

      // 在页面中创建临时元素测试渲染
      const renderResult = await page.evaluate(testChars => {
        const testElement = document.createElement('div');
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.style.fontSize = '16px';
        testElement.style.fontFamily = 'PingFang SC, Microsoft YaHei, sans-serif';
        testElement.textContent = testChars;

        document.body.appendChild(testElement);

        const result = {
          width: testElement.offsetWidth,
          height: testElement.offsetHeight,
          rendered: testElement.offsetWidth > 0
        };

        document.body.removeChild(testElement);
        return result;
      }, chars);

      console.log(
        `  渲染结果: ${renderResult.rendered ? '✅' : '❌'} (${renderResult.width}x${renderResult.height}px)`
      );
    }

    // 截图
    console.log('\n正在生成中文测试截图...');
    await page.screenshot({
      fullPage: true,
      path: 'tools/screenshots/chinese-test-screenshot.png'
    });
    console.log('中文测试截图已保存为 tools/screenshots/chinese-test-screenshot.png');

    console.log('\n🎉 中文支持测试完成!');
  } catch (error) {
    console.log('测试过程中出错:', error.message);
  } finally {
    await browser.close();
  }
}

testChineseSupport().catch(console.error);
