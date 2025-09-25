const puppeteer = require('puppeteer');

// 中文支持的Puppeteer配置
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
  await page.evaluateOnNewDocument(() => {
    // 立即添加字体样式
    const addChineseFonts = () => {
      const style = document.createElement('style');
      style.id = 'chinese-fonts';
      style.textContent = `
        /* 中文字体支持 - 使用系统安装的字体 */
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
          font-family: 'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-size: 14px;
          line-height: 1.5;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif !important;
          font-weight: 600;
        }
        
        button {
          font-family: 'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif !important;
        }
        
        input, textarea {
          font-family: 'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif !important;
        }
      `;

      if (document.head) {
        document.head.appendChild(style);
      } else {
        document.documentElement.appendChild(style);
      }
    };

    // 立即执行
    addChineseFonts();

    // 如果DOM还没准备好，等待加载完成
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

  // 页面加载后强制设置中文字体
  page.on('load', async () => {
    await page.evaluate(() => {
      // 强制重新应用中文字体
      const style = document.createElement('style');
      style.id = 'chinese-fonts-force';
      style.textContent = `
        /* 强制中文字体 - 使用系统安装的字体 */
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
      `;

      // 移除旧的样式
      const oldStyle = document.getElementById('chinese-fonts-force');
      if (oldStyle) {
        oldStyle.remove();
      }

      document.head.appendChild(style);

      // 强制重新渲染
      document.body.style.fontFamily = "'Noto Sans CJK SC', 'WenQuanYi Micro Hei', sans-serif";
    });
  });
}

// 创建支持中文的浏览器实例
async function createChineseBrowser() {
  const browser = await puppeteer.launch(chineseConfig);
  const page = await browser.newPage();
  await setupChineseSupport(page);
  return { browser, page };
}

module.exports = {
  chineseConfig,
  chineseFontCSS,
  setupChineseSupport,
  createChineseBrowser
};
