#!/usr/bin/env node

/**
 * InkDot 项目时间戳工具
 * 用于获取和管理项目相对时间戳
 */

const fs = require('fs');
const path = require('path');
const { execSync: _execSync } = require('child_process');

// 项目启动时间 (T0 基准点)
const PROJECT_START_DATE = new Date('2025-09-21T00:00:00Z');

/**
 * 获取当前项目时间戳
 * @param {Date} currentDate - 当前日期，默认为现在
 * @returns {string} 时间戳格式 (如 T1.5)
 */
function getCurrentTimestamp(currentDate = new Date()) {
  const diffTime = currentDate - PROJECT_START_DATE;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffHours === 0) {
    return `T${diffDays}`;
  } else {
    return `T${diffDays}.${diffHours}`;
  }
}

/**
 * 时间戳转换为日期
 * @param {string} timestamp - 时间戳 (如 T1.5)
 * @returns {Date} 对应的日期
 */
function timestampToDate(timestamp) {
  const match = timestamp.match(/^T(\d+)(?:\.(\d+))?$/);
  if (!match) {
    throw new Error(`无效的时间戳格式: ${timestamp}`);
  }

  const days = parseInt(match[1]);
  const hours = parseInt(match[2] || '0');

  const date = new Date(PROJECT_START_DATE);
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);

  return date;
}

/**
 * 获取下一个审查时间戳
 * @param {string} currentTimestamp - 当前时间戳
 * @param {number} intervalDays - 审查间隔天数 (默认30天)
 * @returns {string} 下次审查时间戳
 */
function getNextReviewTimestamp(currentTimestamp, intervalDays = 30) {
  const match = currentTimestamp.match(/^T(\d+)(?:\.(\d+))?$/);
  if (!match) {
    throw new Error(`无效的时间戳格式: ${currentTimestamp}`);
  }

  const days = parseInt(match[1]);
  const hours = parseInt(match[2] || '0');
  const nextDays = days + intervalDays;

  return hours > 0 ? `T${nextDays}.${hours}` : `T${nextDays}`;
}

/**
 * 格式化时间戳显示
 * @param {string} timestamp - 时间戳
 * @returns {object} 格式化信息
 */
function formatTimestamp(timestamp) {
  const date = timestampToDate(timestamp);
  const match = timestamp.match(/^T(\d+)(?:\.(\d+))?$/);
  const days = parseInt(match[1]);
  const hours = parseInt(match[2] || '0');

  return {
    timestamp,
    days,
    hours,
    date: date.toISOString().split('T')[0],
    description: `项目第${days}天${hours > 0 ? `第${hours}小时` : ''}`
  };
}

/**
 * 生成文档头部时间戳信息
 * @param {string} version - 文档版本
 * @param {string} createTimestamp - 创建时间戳
 * @param {string} updateTimestamp - 更新时间戳 (可选)
 * @returns {string} 文档头部信息
 */
function generateDocHeader(version, createTimestamp, updateTimestamp = null) {
  const current = updateTimestamp || getCurrentTimestamp();
  const nextReview = getNextReviewTimestamp(current);

  return `> **文档版本**：${version}
> **创建时间戳**：${createTimestamp}
> **最后更新**：${current}
> **状态**：🟢 CURRENT
> **维护者**：InkDot开发团队
> **下次审查**：${nextReview}`;
}

/**
 * 更新文档时间戳
 * @param {string} filePath - 文档文件路径
 * @param {string} newTimestamp - 新的时间戳 (可选)
 */
function updateDocumentTimestamp(filePath, newTimestamp = null) {
  if (!fs.existsSync(filePath)) {
    console.error(`文件不存在: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const timestamp = newTimestamp || getCurrentTimestamp();

  // 更新文档头部的时间戳
  const updatedContent = content.replace(
    /> \*\*最后更新\*\*：T\d+(?:\.\d+)?/,
    `> **最后更新**：${timestamp}`
  );

  // 更新下次审查时间
  const nextReview = getNextReviewTimestamp(timestamp);
  const finalContent = updatedContent.replace(
    /> \*\*下次审查\*\*：T\d+(?:\.\d+)?/,
    `> **下次审查**：${nextReview}`
  );

  fs.writeFileSync(filePath, finalContent);
  console.log(`✅ 已更新文档时间戳: ${filePath} -> ${timestamp}`);
}

/**
 * 批量更新文档时间戳
 * @param {string[]} filePaths - 文档文件路径数组
 * @param {string} newTimestamp - 新的时间戳 (可选)
 */
function batchUpdateDocumentTimestamps(filePaths, newTimestamp = null) {
  const timestamp = newTimestamp || getCurrentTimestamp();
  let successCount = 0;
  let errorCount = 0;

  console.log(`🔄 开始批量更新时间戳到: ${timestamp}`);
  console.log(`📁 处理文件数量: ${filePaths.length}`);
  console.log('─'.repeat(50));

  filePaths.forEach((filePath, index) => {
    try {
      if (!fs.existsSync(filePath)) {
        console.error(`❌ [${index + 1}/${filePaths.length}] 文件不存在: ${filePath}`);
        errorCount++;
        return;
      }

      updateDocumentTimestamp(filePath, timestamp);
      successCount++;
    } catch (error) {
      console.error(
        `❌ [${index + 1}/${filePaths.length}] 更新失败: ${filePath} - ${error.message}`
      );
      errorCount++;
    }
  });

  console.log('─'.repeat(50));
  console.log(`✅ 批量更新完成: 成功 ${successCount} 个, 失败 ${errorCount} 个`);
}

/**
 * 查找所有Markdown文档
 * @param {string} rootPath - 根目录路径
 * @param {string[]} excludeDirs - 排除的目录
 * @returns {string[]} Markdown文件路径数组
 */
function findAllMarkdownFiles(
  rootPath = '.',
  excludeDirs = ['node_modules', '.git', 'dist', 'build']
) {
  const markdownFiles = [];

  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // 跳过排除的目录
        if (!excludeDirs.includes(item)) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile() && path.extname(item) === '.md') {
        markdownFiles.push(fullPath);
      }
    });
  }

  scanDirectory(rootPath);
  return markdownFiles;
}

/**
 * 检查文档是否有时间戳头部
 * @param {string} filePath - 文档文件路径
 * @returns {object} 检查结果
 */
function checkDocumentTimestampHeader(filePath) {
  if (!fs.existsSync(filePath)) {
    return { hasHeader: false, reason: '文件不存在' };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').slice(0, 10); // 只检查前10行

  const hasVersion = lines.some(line => line.includes('**文档版本**'));
  const hasTimestamp = lines.some(line => line.includes('**最后更新**'));
  const hasStatus = lines.some(line => line.includes('**状态**'));

  if (hasVersion && hasTimestamp && hasStatus) {
    return { hasHeader: true, reason: '完整的时间戳头部' };
  } else if (hasTimestamp) {
    return { hasHeader: false, reason: '时间戳头部不完整' };
  } else {
    return { hasHeader: false, reason: '缺少时间戳头部' };
  }
}

/**
 * 扫描并报告文档状态
 * @param {string} rootPath - 根目录路径
 */
function scanDocumentStatus(rootPath = '.') {
  const markdownFiles = findAllMarkdownFiles(rootPath);
  const results = {
    total: markdownFiles.length,
    withHeader: 0,
    withoutHeader: 0,
    incomplete: 0,
    details: []
  };

  console.log(`🔍 扫描项目中的Markdown文档...`);
  console.log(`📁 根目录: ${rootPath}`);
  console.log(`📄 找到 ${markdownFiles.length} 个Markdown文件`);
  console.log('─'.repeat(60));

  markdownFiles.forEach(filePath => {
    const check = checkDocumentTimestampHeader(filePath);
    results.details.push({ file: filePath, ...check });

    if (check.hasHeader) {
      results.withHeader++;
    } else if (check.reason === '时间戳头部不完整') {
      results.incomplete++;
    } else {
      results.withoutHeader++;
    }

    const status = check.hasHeader ? '✅' : '❌';
    console.log(`${status} ${filePath} - ${check.reason}`);
  });

  console.log('─'.repeat(60));
  console.log(`📊 统计结果:`);
  console.log(`   ✅ 完整头部: ${results.withHeader} 个`);
  console.log(`   ⚠️  不完整头部: ${results.incomplete} 个`);
  console.log(`   ❌ 缺少头部: ${results.withoutHeader} 个`);
  console.log(`   📄 总计: ${results.total} 个`);

  return results;
}

/**
 * 自动修复文档头部
 * @param {string} filePath - 文档文件路径
 * @param {string} version - 文档版本 (可选)
 * @param {string} createTimestamp - 创建时间戳 (可选)
 */
function autoFixDocumentHeader(filePath, version = 'v1.0.0', createTimestamp = 'T0.1') {
  if (!fs.existsSync(filePath)) {
    console.error(`文件不存在: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // 检查是否已有头部
  const hasHeader = lines.slice(0, 10).some(line => line.includes('**文档版本**'));

  if (hasHeader) {
    // 更新现有头部
    updateDocumentTimestamp(filePath);
    return true;
  } else {
    // 添加新头部
    const timestamp = getCurrentTimestamp();
    const nextReview = getNextReviewTimestamp(timestamp);

    const header = `> **文档版本**：${version}
> **创建时间戳**：${createTimestamp}
> **最后更新**：${timestamp}
> **状态**：CURRENT
> **维护者**：InkDot开发团队
> **下次审查**：${nextReview}

`;

    // 在标题后插入头部
    const titleIndex = lines.findIndex(line => line.startsWith('# '));
    if (titleIndex !== -1) {
      lines.splice(titleIndex + 1, 0, header.trim());
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`✅ 已添加文档头部: ${filePath}`);
      return true;
    } else {
      console.error(`❌ 无法找到文档标题: ${filePath}`);
      return false;
    }
  }
}

/**
 * 命令行工具主函数
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'current':
    case 'now': {
      const current = getCurrentTimestamp();
      const info = formatTimestamp(current);
      console.log(`📅 当前项目时间戳: ${current}`);
      console.log(`📋 详细信息: ${info.description}`);
      console.log(`🗓️  对应日期: ${info.date}`);
      break;
    }

    case 'convert': {
      const timestamp = args[1];
      if (!timestamp) {
        console.error('❌ 请提供时间戳参数');
        process.exit(1);
      }
      try {
        const converted = formatTimestamp(timestamp);
        console.log(`📅 时间戳: ${converted.timestamp}`);
        console.log(`📋 描述: ${converted.description}`);
        console.log(`🗓️  日期: ${converted.date}`);
      } catch (error) {
        console.error(`❌ ${error.message}`);
        process.exit(1);
      }
      break;
    }

    case 'next-review': {
      const baseTimestamp = args[1] || getCurrentTimestamp();
      const interval = parseInt(args[2]) || 30;
      const nextReview = getNextReviewTimestamp(baseTimestamp, interval);
      console.log(`📅 基准时间戳: ${baseTimestamp}`);
      console.log(`🔄 审查间隔: ${interval}天`);
      console.log(`📋 下次审查: ${nextReview}`);
      break;
    }

    case 'update-doc': {
      const docPath = args[1];
      const newTimestamp = args[2];
      if (!docPath) {
        console.error('❌ 请提供文档路径');
        process.exit(1);
      }
      updateDocumentTimestamp(docPath, newTimestamp);
      break;
    }

    case 'header': {
      const version = args[1] || 'v1.0.0';
      const createTs = args[2] || 'T0';
      const updateTs = args[3];
      console.log(generateDocHeader(version, createTs, updateTs));
      break;
    }

    case 'scan':
    case 'check': {
      const rootPath = args[1] || '.';
      scanDocumentStatus(rootPath);
      break;
    }

    case 'batch-update':
    case 'batch': {
      const timestamp = args[1] || getCurrentTimestamp();
      const rootPath = args[2] || '.';
      const markdownFiles = findAllMarkdownFiles(rootPath);

      if (markdownFiles.length === 0) {
        console.log('❌ 未找到任何Markdown文件');
        break;
      }

      batchUpdateDocumentTimestamps(markdownFiles, timestamp);
      break;
    }

    case 'fix-headers': {
      const rootPath = args[1] || '.';
      const version = args[2] || 'v1.0.0';
      const createTimestamp = args[3] || 'T0.1';

      const markdownFiles = findAllMarkdownFiles(rootPath);
      let fixedCount = 0;

      console.log(`🔧 开始自动修复文档头部...`);
      console.log(`📁 根目录: ${rootPath}`);
      console.log(`📄 处理文件数量: ${markdownFiles.length}`);
      console.log('─'.repeat(50));

      markdownFiles.forEach((filePath, index) => {
        try {
          if (autoFixDocumentHeader(filePath, version, createTimestamp)) {
            fixedCount++;
          }
        } catch (error) {
          console.error(
            `❌ [${index + 1}/${markdownFiles.length}] 修复失败: ${filePath} - ${error.message}`
          );
        }
      });

      console.log('─'.repeat(50));
      console.log(`✅ 自动修复完成: 成功修复 ${fixedCount} 个文档`);
      break;
    }

    case 'find-md': {
      const rootPath = args[1] || '.';
      const excludeDirs = args.slice(2) || ['node_modules', '.git', 'dist', 'build'];

      console.log(`🔍 查找Markdown文件...`);
      console.log(`📁 根目录: ${rootPath}`);
      console.log(`🚫 排除目录: ${excludeDirs.join(', ')}`);
      console.log('─'.repeat(50));

      const markdownFiles = findAllMarkdownFiles(rootPath, excludeDirs);
      markdownFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });

      console.log('─'.repeat(50));
      console.log(`📄 总计找到 ${markdownFiles.length} 个Markdown文件`);
      break;
    }

    case 'check-timestamp': {
      // Pre-commit专用：检查Markdown文件的时间戳
      const filePaths = args.slice(1); // 从lint-staged获取的文件路径
      if (filePaths.length === 0) {
        console.log('📋 没有Markdown文件需要检查时间戳');
        break;
      }

      let hasErrors = false;
      filePaths.forEach(filePath => {
        if (path.extname(filePath) === '.md') {
          const status = checkDocumentTimestampHeader(filePath);
          if (status && !status.hasHeader) {
            console.error(`❌ ${filePath}: 缺少时间戳头部信息`);
            hasErrors = true;
          } else if (status && status.hasHeader && !status.isValid) {
            console.warn(`⚠️  ${filePath}: 时间戳头部格式可能有问题`);
          } else if (status && status.hasHeader && status.isValid) {
            console.log(`✅ ${filePath}: 时间戳检查通过`);
          }
        }
      });

      if (hasErrors) {
        console.error('\n❌ 部分Markdown文件缺少时间戳头部，请运行 npm run docs:fix 修复');
        process.exit(1);
      }
      break;
    }

    case 'help':
    default:
      console.log(`
📋 InkDot 时间戳工具使用说明

🎯 基本命令:
  current, now              获取当前项目时间戳
  convert <timestamp>       转换时间戳为详细信息
  next-review <timestamp>   计算下次审查时间戳
  update-doc <path>         更新文档时间戳
  header <version> <create> 生成文档头部信息

🔍 批量操作命令:
  scan [path]               扫描并报告文档状态
  batch-update [timestamp] [path]  批量更新时间戳
  fix-headers [path] [version] [create]  自动修复文档头部
  find-md [path] [exclude...]  查找所有Markdown文件
  check-timestamp [files...]  检查指定文件的时间戳（用于pre-commit）

📝 使用示例:
  # 基本操作
  node timestamp-helper.js current
  node timestamp-helper.js convert T1.5
  node timestamp-helper.js update-doc docs/README.md

  # 批量操作
  node timestamp-helper.js scan                    # 扫描所有文档状态
  node timestamp-helper.js batch-update T0.3      # 批量更新时间戳到T0.3
  node timestamp-helper.js fix-headers             # 自动修复所有文档头部
  node timestamp-helper.js find-md src/           # 查找src目录下的Markdown文件

🕐 时间戳格式:
  T0      - 项目启动 (${PROJECT_START_DATE.toISOString().split('T')[0]})
  T1      - 项目第1天
  T1.5    - 项目第1天第5小时
  T30     - 项目第30天 (1个月)
  T90     - 项目第90天 (3个月)

📋 项目基准时间: ${PROJECT_START_DATE.toISOString().split('T')[0]} (T0)
`);
      break;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

// 导出函数供其他模块使用
module.exports = {
  getCurrentTimestamp,
  timestampToDate,
  getNextReviewTimestamp,
  formatTimestamp,
  generateDocHeader,
  updateDocumentTimestamp,
  batchUpdateDocumentTimestamps,
  findAllMarkdownFiles,
  checkDocumentTimestampHeader,
  scanDocumentStatus,
  autoFixDocumentHeader,
  PROJECT_START_DATE
};
