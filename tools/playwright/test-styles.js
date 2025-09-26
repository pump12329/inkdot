#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3003';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');

// 确保截图目录存在
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function testStyles() {
  console.log('🎨 开始测试样式系统...');

  const browser = await chromium.launch({
    headless: true, // 在服务器环境使用headless模式
    args: ['--no-sandbox', '--disable-dev-shm-usage'] // Docker/CI环境友好的参数
  });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  });

  const page = await context.newPage();

  // 监听控制台消息
  page.on('console', msg => {
    console.log('页面日志:', msg.text());
  });

  // 监听页面错误
  page.on('pageerror', error => {
    console.error('页面错误:', error.message);
  });

  try {
    // 1. 加载页面
    console.log('\n📄 加载应用页面...');
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // 截图：整体页面
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-full-page.png'),
      fullPage: true
    });
    console.log('✅ 页面加载完成');

    // 2. 测试头部样式
    console.log('\n🎯 测试应用头部...');
    const header = await page.locator('.app-header');
    await expect(header).toBeVisible();

    const title = await page.locator('h1');
    const titleText = await title.textContent();
    console.log(`标题文本: ${titleText}`);

    // 3. 测试悬浮工具栏
    console.log('\n🛠️ 测试悬浮工具栏...');
    const toolbar = await page.locator('.floating-toolbar');
    await expect(toolbar).toBeVisible();

    // 测试工具栏按钮
    const toolbarButtons = await page.locator('.floating-toolbar .btn').all();
    console.log(`工具栏按钮数量: ${toolbarButtons.length}`);

    // 截图：工具栏特写
    await toolbar.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-floating-toolbar.png')
    });

    // 4. 测试按钮交互
    console.log('\n🔘 测试按钮交互...');

    // 测试创建示例节点按钮
    const createNodeBtn = await page.locator('text=创建示例节点');
    if (await createNodeBtn.isVisible()) {
      await createNodeBtn.click();
      await page.waitForTimeout(1000);
      console.log('✅ 创建示例节点按钮点击成功');

      // 检查是否出现示例节点
      const sampleNode = await page.locator('.mindmap-node');
      if (await sampleNode.isVisible()) {
        console.log('✅ 示例节点显示成功');
        await sampleNode.screenshot({
          path: path.join(SCREENSHOTS_DIR, '03-sample-node.png')
        });
      }
    }

    // 5. 测试网格切换
    console.log('\n📐 测试网格切换...');
    const gridBtn = await page.locator('text=显示网格');
    if (await gridBtn.isVisible()) {
      await gridBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ 网格切换成功');
    }

    // 6. 测试侧边面板
    console.log('\n📱 测试侧边面板...');
    const sidePanel = await page.locator('.side-panel');
    if (await sidePanel.isVisible()) {
      console.log('✅ 侧边面板可见');

      // 测试面板中的按钮样式
      const panelButtons = await sidePanel.locator('.btn').all();
      console.log(`面板按钮数量: ${panelButtons.length}`);

      // 截图：侧边面板
      await sidePanel.screenshot({
        path: path.join(SCREENSHOTS_DIR, '04-side-panel.png')
      });
    }

    // 7. 测试响应式设计
    console.log('\n📱 测试响应式设计...');

    // 切换到移动端视图
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-mobile-view.png'),
      fullPage: true
    });
    console.log('✅ 移动端视图截图完成');

    // 切换到平板视图
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-tablet-view.png'),
      fullPage: true
    });
    console.log('✅ 平板视图截图完成');

    // 恢复桌面视图
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);

    // 8. 测试主题系统（如果有主题切换）
    console.log('\n🌙 测试主题系统...');

    // 检查CSS变量是否正确加载
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        colorPrimary: styles.getPropertyValue('--color-primary'),
        colorBackground: styles.getPropertyValue('--color-background'),
        fontFamilyBase: styles.getPropertyValue('--font-family-base'),
        spacingBase: styles.getPropertyValue('--space-4')
      };
    });

    console.log('CSS变量值:', rootStyles);

    // 9. 测试字体渲染
    console.log('\n🔤 测试字体渲染...');

    const fontTest = await page.evaluate(() => {
      const testText = '中文字体测试 English Font Test 123';
      const elements = document.querySelectorAll('h1, p, button, span');
      const results = [];

      elements.forEach((el, index) => {
        if (el.textContent && el.textContent.trim()) {
          const styles = getComputedStyle(el);
          results.push({
            index,
            text: el.textContent.substring(0, 30),
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight
          });
        }
      });

      return results.slice(0, 10); // 只返回前10个元素
    });

    console.log('字体渲染测试结果:');
    fontTest.forEach(result => {
      console.log(
        `  ${result.index}: ${result.text} | ${result.fontFamily} | ${result.fontSize} | ${result.fontWeight}`
      );
    });

    // 10. 最终截图
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-final-state.png'),
      fullPage: true
    });

    console.log('\n🎉 样式测试完成！');
    console.log(`📸 截图已保存到: ${SCREENSHOTS_DIR}`);
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);

    // 错误截图
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, 'error-screenshot.png'),
      fullPage: true
    });
  } finally {
    await browser.close();
  }
}

// 样式质量分析
async function analyzeStyles() {
  console.log('\n🔍 分析样式质量...');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);

    // 分析CSS加载性能
    const performanceMetrics = await page.evaluate(() => {
      const perfEntries = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded:
          perfEntries.domContentLoadedEventEnd - perfEntries.domContentLoadedEventStart,
        loadComplete: perfEntries.loadEventEnd - perfEntries.loadEventStart,
        totalLoadTime: perfEntries.loadEventEnd - perfEntries.navigationStart
      };
    });

    console.log('性能指标:', performanceMetrics);

    // 分析CSS规则数量
    const cssAnalysis = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      let totalRules = 0;
      let totalSelectors = 0;

      sheets.forEach(sheet => {
        try {
          if (sheet.cssRules) {
            totalRules += sheet.cssRules.length;
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule.selectorText) {
                totalSelectors += rule.selectorText.split(',').length;
              }
            });
          }
        } catch (e) {
          // 跨域样式表可能无法访问
        }
      });

      return { totalRules, totalSelectors, sheetsCount: sheets.length };
    });

    console.log('CSS分析:', cssAnalysis);

    // 检查可访问性
    const accessibilityCheck = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, input, [role="button"]');
      const issues = [];

      elements.forEach(el => {
        const styles = getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const color = styles.color;

        // 简单的对比度检查（这里只是示例）
        if (bgColor === 'rgba(0, 0, 0, 0)' && color === 'rgb(0, 0, 0)') {
          issues.push('可能的对比度问题');
        }

        // 检查焦点样式
        if (!el.style.outline && !styles.outline) {
          // 这个检查不太准确，实际应该测试:focus状态
        }
      });

      return {
        totalInteractiveElements: elements.length,
        potentialIssues: issues.length
      };
    });

    console.log('可访问性检查:', accessibilityCheck);
  } catch (error) {
    console.error('分析过程中发生错误:', error);
  } finally {
    await browser.close();
  }
}

// 添加expect函数（简化版）
async function expect(locator) {
  return {
    toBeVisible: async () => {
      const isVisible = await locator.isVisible();
      if (!isVisible) {
        throw new Error('Element is not visible');
      }
    }
  };
}

// 主函数
async function main() {
  console.log('🎨 InkDot 样式系统测试工具');
  console.log('='.repeat(40));

  try {
    await testStyles();
    await analyzeStyles();

    console.log('\n📋 改进建议:');
    console.log('1. 检查截图中的样式一致性');
    console.log('2. 验证响应式设计在不同设备上的表现');
    console.log('3. 确认字体在不同系统上的渲染效果');
    console.log('4. 测试主题切换功能');
    console.log('5. 验证可访问性和键盘导航');
    console.log('6. 检查动画性能和流畅度');
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
