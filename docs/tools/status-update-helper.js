#!/usr/bin/env node

/**
 * InkDot 文档状态总览自动更新工具
 *
 * 功能：
 * - 自动扫描项目中的所有Markdown文档
 * - 解析文档头部信息（版本、时间戳、状态）
 * - 自动更新CHANGELOG中的文档状态总览
 * - 支持分类显示（当前、开发中、过时、废弃）
 *
 * 使用方法：
 * node docs/tools/status-update-helper.js [command] [options]
 *
 * 命令：
 * - update: 更新文档状态总览
 * - scan: 扫描文档状态
 * - check: 检查文档状态一致性
 * - help: 显示帮助信息
 */

import fs from 'fs';
import path from 'path';
import { execSync as _execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置文件
const CONFIG = {
  changelogPath: 'docs/CHANGELOG.md',
  projectRoot: process.cwd(),
  excludePatterns: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
  documentCategories: {
    current: {
      title: '🟢 当前文档 (CURRENT)',
      status: 'CURRENT',
      icon: '🟢'
    },
    draft: {
      title: '🚧 开发中文档 (DRAFT)',
      status: 'DRAFT',
      icon: '🚧'
    },
    outdated: {
      title: '🟡 计划更新文档 (OUTDATED)',
      status: 'OUTDATED',
      icon: '🟡'
    },
    deprecated: {
      title: '🔴 已废弃文档 (DEPRECATED)',
      status: 'DEPRECATED',
      icon: '🔴'
    }
  }
};

/**
 * 获取当前时间戳
 */
function getCurrentTimestamp() {
  const now = new Date();
  const startDate = new Date('2025-09-21');
  const diffTime = now - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `T${diffDays}.${diffHours}`;
}

/**
 * 递归查找所有Markdown文件
 */
function findAllMarkdownFiles(dir = '.', excludeDirs = []) {
  const files = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative('.', fullPath);

      // 跳过排除的目录
      if (entry.isDirectory()) {
        if (!excludeDirs.some(pattern => relativePath.includes(pattern.replace('**', '')))) {
          files.push(...findAllMarkdownFiles(fullPath, excludeDirs));
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(relativePath);
      }
    }
  } catch (error) {
    console.error(`读取目录 ${dir} 失败:`, error.message);
  }

  return files;
}

/**
 * 解析文档头部信息
 */
function parseDocumentHeader(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const header = {
      file: filePath,
      version: null,
      createTime: null,
      lastUpdate: null,
      status: null,
      maintainer: null,
      nextReview: null,
      valid: false
    };

    // 查找头部信息
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i].trim();

      if (line.startsWith('> **文档版本**：')) {
        header.version = line.replace('> **文档版本**：', '').trim();
      } else if (line.startsWith('> **创建时间戳**：')) {
        header.createTime = line.replace('> **创建时间戳**：', '').trim();
      } else if (line.startsWith('> **最后更新**：')) {
        header.lastUpdate = line.replace('> **最后更新**：', '').trim();
      } else if (line.startsWith('> **状态**：')) {
        header.status = line
          .replace('> **状态**：', '')
          .trim()
          .replace(/🟢\s*/, '')
          .replace(/🚧\s*/, '')
          .replace(/🟡\s*/, '')
          .replace(/🔴\s*/, '');
      } else if (line.startsWith('> **维护者**：')) {
        header.maintainer = line.replace('> **维护者**：', '').trim();
      } else if (line.startsWith('> **下次审查**：')) {
        header.nextReview = line.replace('> **下次审查**：', '').trim();
      }
    }

    // 检查是否包含必要的头部信息（创建时间戳是可选的）
    header.valid = !!(header.version && header.lastUpdate && header.status);

    return header;
  } catch (error) {
    console.error(`解析文档 ${filePath} 头部失败:`, error.message);
    return {
      file: filePath,
      valid: false,
      error: error.message
    };
  }
}

/**
 * 扫描所有文档状态
 */
function scanDocumentStatus() {
  console.log('🔍 扫描项目文档状态...');

  const mdFiles = findAllMarkdownFiles('.', ['node_modules', '.git', 'dist', 'build']);
  const documents = [];

  for (const file of mdFiles) {
    const header = parseDocumentHeader(file);
    documents.push(header);
  }

  // 按状态分类
  const categorized = {
    current: [],
    draft: [],
    outdated: [],
    deprecated: [],
    invalid: []
  };

  for (const doc of documents) {
    if (!doc.valid) {
      categorized.invalid.push(doc);
      continue;
    }

    const status = doc.status.toUpperCase();
    switch (status) {
      case 'CURRENT':
        categorized.current.push(doc);
        break;
      case 'DRAFT':
        categorized.draft.push(doc);
        break;
      case 'OUTDATED':
        categorized.outdated.push(doc);
        break;
      case 'DEPRECATED':
        categorized.deprecated.push(doc);
        break;
      default:
        categorized.invalid.push(doc);
    }
  }

  return { documents, categorized };
}

/**
 * 生成状态表格行
 */
function generateStatusTableRow(doc) {
  const fileName = path.basename(doc.file);
  const relativePath = path.dirname(doc.file);
  const displayPath = relativePath !== '.' ? `${relativePath}/${fileName}` : fileName;

  return `| ${displayPath} | ${doc.version} | ${doc.lastUpdate} | ${CONFIG.documentCategories.current.icon} CURRENT |`;
}

/**
 * 生成草稿表格行
 */
function generateDraftTableRow(doc) {
  const fileName = path.basename(doc.file);
  const relativePath = path.dirname(doc.file);
  const displayPath = relativePath !== '.' ? `${relativePath}/${fileName}` : fileName;

  // 如果没有下次审查时间，使用默认值
  const nextReview = doc.nextReview || 'T30.0';

  return `| ${displayPath} | ${doc.version} | ${nextReview} | ${CONFIG.documentCategories.draft.icon} DRAFT |`;
}

/**
 * 生成过时表格行
 */
function generateOutdatedTableRow(doc) {
  const fileName = path.basename(doc.file);
  const relativePath = path.dirname(doc.file);
  const displayPath = relativePath !== '.' ? `${relativePath}/${fileName}` : fileName;

  return `| ${displayPath} | ${doc.version} | ${doc.lastUpdate} | ${CONFIG.documentCategories.outdated.icon} OUTDATED |`;
}

/**
 * 生成废弃表格行
 */
function generateDeprecatedTableRow(doc) {
  const fileName = path.basename(doc.file);
  const relativePath = path.dirname(doc.file);
  const displayPath = relativePath !== '.' ? `${relativePath}/${fileName}` : fileName;

  return `| ${displayPath} | ${doc.version} | ${doc.lastUpdate} | ${CONFIG.documentCategories.deprecated.icon} DEPRECATED |`;
}

/**
 * 生成状态总览表格
 */
function generateStatusOverview(categorized) {
  let content = '';

  // 当前文档表格
  if (categorized.current.length > 0) {
    content += `### ${CONFIG.documentCategories.current.title}\n`;
    content += '| 文档名称 | 版本 | 最后更新 | 状态 |\n';
    content += '|---------|------|----------|------|\n';

    for (const doc of categorized.current) {
      content += `${generateStatusTableRow(doc)}\n`;
    }
    content += '\n';
  }

  // 开发中文档表格
  if (categorized.draft.length > 0) {
    content += `### ${CONFIG.documentCategories.draft.title}\n`;
    content += '| 文档名称 | 版本 | 预计完成 | 状态 |\n';
    content += '|---------|------|----------|------|\n';

    for (const doc of categorized.draft) {
      content += `${generateDraftTableRow(doc)}\n`;
    }
    content += '\n';
  }

  // 过时文档表格
  if (categorized.outdated.length > 0) {
    content += `### ${CONFIG.documentCategories.outdated.title}\n`;
    content += '| 文档名称 | 版本 | 最后更新 | 状态 |\n';
    content += '|---------|------|----------|------|\n';

    for (const doc of categorized.outdated) {
      content += `${generateOutdatedTableRow(doc)}\n`;
    }
    content += '\n';
  } else {
    content += `### ${CONFIG.documentCategories.outdated.title}\n`;
    content += '*当前无过时文档*\n\n';
  }

  // 废弃文档表格
  if (categorized.deprecated.length > 0) {
    content += `### ${CONFIG.documentCategories.deprecated.title}\n`;
    content += '| 文档名称 | 版本 | 最后更新 | 状态 |\n';
    content += '|---------|------|----------|------|\n';

    for (const doc of categorized.deprecated) {
      content += `${generateDeprecatedTableRow(doc)}\n`;
    }
    content += '\n';
  } else {
    content += `### ${CONFIG.documentCategories.deprecated.title}\n`;
    content += '*当前无废弃文档*\n\n';
  }

  return content;
}

/**
 * 更新CHANGELOG中的文档状态总览
 */
function updateChangelogStatusOverview() {
  console.log('📊 更新CHANGELOG文档状态总览...');

  try {
    // 扫描文档状态
    const { categorized } = scanDocumentStatus();

    // 生成新的状态总览
    const newStatusOverview = generateStatusOverview(categorized);

    // 读取CHANGELOG文件
    const changelogContent = fs.readFileSync(CONFIG.changelogPath, 'utf8');

    // 查找文档状态总览部分
    const statusOverviewStart = changelogContent.indexOf('## 📊 文档状态总览');
    if (statusOverviewStart === -1) {
      console.error('❌ 无法找到文档状态总览部分');
      return false;
    }

    // 查找下一个主要部分
    const nextSectionMatch = changelogContent.match(/^## [^📊]/mu);
    const statusOverviewEnd = nextSectionMatch ? nextSectionMatch.index : changelogContent.length;

    // 替换状态总览部分
    const beforeStatus = changelogContent.substring(0, statusOverviewStart);
    const afterStatus = changelogContent.substring(statusOverviewEnd);
    const newChangelog = `${beforeStatus}## 📊 文档状态总览\n\n${newStatusOverview}${afterStatus}`;

    // 写入文件
    fs.writeFileSync(CONFIG.changelogPath, newChangelog, 'utf8');

    console.log('✅ 文档状态总览已更新');

    // 显示统计信息
    console.log('\n📈 更新统计:');
    console.log(`  🟢 当前文档: ${categorized.current.length} 个`);
    console.log(`  🚧 开发中文档: ${categorized.draft.length} 个`);
    console.log(`  🟡 过时文档: ${categorized.outdated.length} 个`);
    console.log(`  🔴 废弃文档: ${categorized.deprecated.length} 个`);
    console.log(`  ❌ 无效文档: ${categorized.invalid.length} 个`);

    return true;
  } catch (error) {
    console.error('❌ 更新文档状态总览失败:', error.message);
    return false;
  }
}

/**
 * 检查文档状态一致性
 */
function checkDocumentStatusConsistency() {
  console.log('🔍 检查文档状态一致性...');

  const { documents, categorized } = scanDocumentStatus();

  console.log('\n📊 文档状态统计:');
  console.log(`  总计文档: ${documents.length} 个`);
  console.log(`  🟢 当前文档: ${categorized.current.length} 个`);
  console.log(`  🚧 开发中文档: ${categorized.draft.length} 个`);
  console.log(`  🟡 过时文档: ${categorized.outdated.length} 个`);
  console.log(`  🔴 废弃文档: ${categorized.deprecated.length} 个`);
  console.log(`  ❌ 无效文档: ${categorized.invalid.length} 个`);

  if (categorized.invalid.length > 0) {
    console.log('\n⚠️ 无效文档列表:');
    for (const doc of categorized.invalid) {
      console.log(`  - ${doc.file}: ${doc.error || '缺少必要头部信息'}`);
    }
  }

  if (categorized.outdated.length > 0) {
    console.log('\n🟡 过时文档列表:');
    for (const doc of categorized.outdated) {
      console.log(`  - ${doc.file} (${doc.version}, ${doc.lastUpdate})`);
    }
  }

  if (categorized.deprecated.length > 0) {
    console.log('\n🔴 废弃文档列表:');
    for (const doc of categorized.deprecated) {
      console.log(`  - ${doc.file} (${doc.version}, ${doc.lastUpdate})`);
    }
  }

  return { documents, categorized };
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
InkDot 文档状态总览自动更新工具

用法: node docs/tools/status-update-helper.js <command> [options]

命令:
  update                  更新CHANGELOG中的文档状态总览 (默认)
  scan                    扫描项目文档状态
  check                   检查文档状态一致性
  help                    显示帮助信息

功能:
  - 自动扫描项目中的所有Markdown文档
  - 解析文档头部信息（版本、时间戳、状态）
  - 按状态分类显示（当前、开发中、过时、废弃）
  - 自动更新CHANGELOG中的文档状态总览表格
  - 检查文档头部信息的完整性和一致性

文档状态类型:
  🟢 CURRENT  - 当前版本，推荐使用
  🚧 DRAFT    - 草稿状态，开发中
  🟡 OUTDATED - 过时版本，计划更新
  🔴 DEPRECATED - 已废弃，不再维护

示例:
  node docs/tools/status-update-helper.js update
  node docs/tools/status-update-helper.js scan
  node docs/tools/status-update-helper.js check
  `);
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'update';

  switch (command) {
    case 'update':
      updateChangelogStatusOverview();
      break;

    case 'scan':
      scanDocumentStatus();
      break;

    case 'check':
      checkDocumentStatusConsistency();
      break;

    case 'help':
    default:
      showHelp();
      break;
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  updateChangelogStatusOverview,
  scanDocumentStatus,
  checkDocumentStatusConsistency,
  findAllMarkdownFiles,
  parseDocumentHeader,
  getCurrentTimestamp
};
