import { createChineseBrowser, testChineseFont } from './playwright-chinese-config.js';

async function testButtons() {
  const { browser, context, page } = await createChineseBrowser();

  // 监听控制台消息
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  try {
    console.log('正在访问 http://localhost:3000...');

    // 访问页面
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('页面加载完成，等待Vue应用启动...');

    // 等待Vue应用启动
    await page.waitForTimeout(3000);

    // 测试中文字体
    await testChineseFont(page);

    console.log('\n=== 开始测试按钮功能 ===');

    // 查找并点击按钮
    const buttons = await page.locator('button').all();
    console.log(`找到 ${buttons.length} 个按钮`);

    for (let i = 0; i < buttons.length && i < 5; i++) {
      const button = buttons[i];
      const buttonText = await button.textContent();
      console.log(`\n测试按钮 ${i + 1}: "${buttonText}"`);

      try {
        // 检查按钮是否可见和可点击
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();

        console.log(`  可见: ${isVisible}, 可点击: ${isEnabled}`);

        if (isVisible && isEnabled) {
          // 点击按钮
          await button.click();
          console.log(`  ✅ 成功点击按钮: "${buttonText}"`);

          // 等待页面响应
          await page.waitForTimeout(1000);

          // 检查页面是否有变化
          const pageContent = await page.evaluate(() => document.body.innerText);
          console.log(`  页面内容长度: ${pageContent.length}`);
        } else {
          console.log(`  ❌ 按钮不可点击: "${buttonText}"`);
        }
      } catch (error) {
        console.log(`  ❌ 点击按钮失败: ${error.message}`);
      }
    }

    console.log('\n=== 测试键盘快捷键 ===');

    // 测试常用快捷键
    const shortcuts = [
      { key: 'Tab', description: 'Tab键导航' },
      { key: 'Enter', description: '回车键' },
      { key: 'Escape', description: 'ESC键' }
    ];

    for (const shortcut of shortcuts) {
      console.log(`\n测试快捷键: ${shortcut.description}`);
      try {
        await page.keyboard.press(shortcut.key);
        await page.waitForTimeout(500);
        console.log(`  ✅ 成功按下 ${shortcut.key}`);
      } catch (error) {
        console.log(`  ❌ 快捷键测试失败: ${error.message}`);
      }
    }

    console.log('\n=== 测试输入功能 ===');

    // 查找输入框
    const inputs = await page.locator('input, textarea').all();
    console.log(`找到 ${inputs.length} 个输入框`);

    for (let i = 0; i < inputs.length && i < 3; i++) {
      const input = inputs[i];

      try {
        const isVisible = await input.isVisible();
        const isEnabled = await input.isEnabled();

        if (isVisible && isEnabled) {
          console.log(`\n测试输入框 ${i + 1}`);

          // 清空输入框
          await input.fill('');

          // 输入中文文本
          const testText = '这是中文测试文本';
          await input.fill(testText);

          // 验证输入
          const inputValue = await input.inputValue();
          console.log(`  输入文本: "${testText}"`);
          console.log(`  实际值: "${inputValue}"`);
          console.log(`  输入成功: ${inputValue === testText}`);

          // 测试键盘导航
          await input.press('Tab');
          console.log(`  ✅ Tab键导航测试完成`);
        } else {
          console.log(`  ❌ 输入框 ${i + 1} 不可用`);
        }
      } catch (error) {
        console.log(`  ❌ 输入框测试失败: ${error.message}`);
      }
    }

    console.log('\n=== 测试拖拽功能 ===');

    // 查找可拖拽的元素
    const draggableElements = await page.locator('[draggable="true"], .draggable, .node').all();
    console.log(`找到 ${draggableElements.length} 个可拖拽元素`);

    if (draggableElements.length > 0) {
      const element = draggableElements[0];
      const isVisible = await element.isVisible();

      if (isVisible) {
        try {
          const boundingBox = await element.boundingBox();
          if (boundingBox) {
            console.log(`  测试拖拽元素，位置: (${boundingBox.x}, ${boundingBox.y})`);

            // 执行拖拽操作
            await page.mouse.move(
              boundingBox.x + boundingBox.width / 2,
              boundingBox.y + boundingBox.height / 2
            );
            await page.mouse.down();
            await page.mouse.move(boundingBox.x + 100, boundingBox.y + 100);
            await page.mouse.up();

            console.log(`  ✅ 拖拽操作完成`);
          } else {
            console.log(`  ❌ 无法获取元素位置`);
          }
        } catch (error) {
          console.log(`  ❌ 拖拽测试失败: ${error.message}`);
        }
      } else {
        console.log(`  ❌ 拖拽元素不可见`);
      }
    } else {
      console.log(`  ℹ️ 未找到可拖拽元素`);
    }

    // 最终截图
    console.log('\n正在生成测试截图...');
    await page.screenshot({
      fullPage: true,
      path: 'tools/screenshots/button-test-screenshot.png'
    });
    console.log('按钮测试截图已保存为 tools/screenshots/button-test-screenshot.png');

    console.log('\n🎉 按钮功能测试完成!');
  } catch (error) {
    console.log('测试过程中出错:', error.message);
  } finally {
    await browser.close();
  }
}

testButtons().catch(console.error);
