const { chromium } = require('playwright');

// 中文支持的Playwright配置
const chineseConfig = {
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
    '--disable-plugins',
    '--disable-images',
    '--disable-javascript',
    '--disable-default-apps'
  ]
};

// 中文字体CSS
const chineseFontCSS = `
  * {
    font-family: 
      -apple-system, 
      BlinkMacSystemFont, 
      'Segoe UI', 
      'PingFang SC', 
      'Hiragino Sans GB', 
      'Microsoft YaHei', 
      'WenQuanYi Micro Hei', 
      'WenQuanYi Zen Hei', 
      'Noto Sans CJK SC', 
      'Source Han Sans SC', 
      'Helvetica Neue', 
      Helvetica, 
      Arial, 
      sans-serif !important;
  }
  
  /* 确保中文字符正确显示 */
  body, html {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* 标题字体 */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
    font-weight: 600;
  }
  
  /* 按钮字体 */
  button {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
  }
  
  /* 输入框字体 */
  input, textarea {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
  }
`;

// 设置页面中文支持
async function setupChineseSupport(page) {
  // 设置中文字体 - 使用更直接的方式
  await page.addStyleTag({
    content: chineseFontCSS
  });

  // 设置页面语言
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  });

  // 在页面加载前注入字体样式
  await page.addInitScript(() => {
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

  console.log('✅ 中文字体支持已设置');
}

// 创建支持中文的浏览器实例
async function createChineseBrowser() {
  console.log('🚀 启动支持中文的Playwright浏览器...');

  const browser = await chromium.launch(chineseConfig);
  const _context = await browser.newContext({
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    viewport: { width: 1280, height: 720 }
  });

  const page = await _context.newPage();

  // 设置中文支持
  await setupChineseSupport(page);

  console.log('✅ 浏览器启动成功，中文支持已配置');

  return { browser, _context, page };
}

// 测试中文字体是否正确加载
async function testChineseFont(page) {
  console.log('🔍 测试中文字体支持...');

  const testResult = await page.evaluate(() => {
    // 创建测试元素
    const testElement = document.createElement('div');
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.fontSize = '20px';
    testElement.style.fontFamily = 'PingFang SC, Microsoft YaHei, sans-serif';
    testElement.textContent = '中文字体测试';

    document.body.appendChild(testElement);

    // 检查字体
    const computedStyle = window.getComputedStyle(testElement);
    const result = {
      text: testElement.textContent,
      fontFamily: computedStyle.fontFamily,
      fontSize: computedStyle.fontSize,
      width: testElement.offsetWidth,
      height: testElement.offsetHeight
    };

    document.body.removeChild(testElement);
    return result;
  });

  console.log('📊 中文字体测试结果:');
  console.log(`   文本: ${testResult.text}`);
  console.log(`   字体: ${testResult.fontFamily}`);
  console.log(`   大小: ${testResult.fontSize}`);
  console.log(`   尺寸: ${testResult.width}x${testResult.height}px`);

  return testResult;
}

// 强制应用中文字体到页面
async function forceChineseFont(page) {
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

  console.log('✅ 已强制应用中文字体');
}

module.exports = {
  chineseConfig,
  chineseFontCSS,
  createChineseBrowser,
  setupChineseSupport,
  testChineseFont,
  forceChineseFont
};
