#!/usr/bin/env node

/**
 * InkDot 自动变更条目工具
 * 
 * 功能：
 * - 自动检测项目变更类型
 * - 智能生成变更条目描述
 * - 支持多种变更检测模式
 * - 自动添加到CHANGELOG
 * 
 * 使用方法：
 * node docs/tools/change-entry-helper.js [command] [options]
 * 
 * 命令：
 * - auto: 自动检测并添加变更条目
 * - detect: 检测变更类型
 * - add: 手动添加变更条目
 * - scan: 扫描项目变更
 * - help: 显示帮助信息
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置文件
const CONFIG = {
  changelogPath: 'docs/CHANGELOG.md',
  projectRoot: process.cwd(),
  changeTypes: {
    'feature': {
      keywords: ['feat', 'feature', 'add', 'new', 'implement', 'create'],
      icon: '🆕',
      title: '新增功能',
      category: 'features'
    },
    'fix': {
      keywords: ['fix', 'bug', 'error', 'issue', 'resolve', 'correct'],
      icon: '🐛',
      title: '问题修复',
      category: 'bugfixes'
    },
    'improvement': {
      keywords: ['improve', 'enhance', 'optimize', 'better', 'upgrade', 'refactor'],
      icon: '⚡',
      title: '功能改进',
      category: 'improvements'
    },
    'documentation': {
      keywords: ['docs', 'documentation', 'readme', 'guide', 'manual'],
      icon: '📝',
      title: '文档更新',
      category: 'documentation'
    },
    'style': {
      keywords: ['style', 'format', 'design', 'ui', 'css', 'theme'],
      icon: '🎨',
      title: '样式调整',
      category: 'styling'
    },
    'test': {
      keywords: ['test', 'testing', 'spec', 'coverage', 'unit'],
      icon: '✅',
      title: '测试相关',
      category: 'testing'
    },
    'build': {
      keywords: ['build', 'config', 'setup', 'install', 'dependencies'],
      icon: '🏗️',
      title: '构建配置',
      category: 'build'
    },
    'security': {
      keywords: ['security', 'vulnerability', 'safe', 'protect', 'auth'],
      icon: '🔒',
      title: '安全相关',
      category: 'security'
    }
  },
  filePatterns: {
    'feature': ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.js'],
    'fix': ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.js'],
    'documentation': ['docs/**/*.md', '*.md'],
    'style': ['src/**/*.css', 'src/**/*.scss', 'src/**/*.vue'],
    'test': ['tests/**/*.ts', 'tests/**/*.js', '**/*.test.*', '**/*.spec.*'],
    'build': ['package.json', 'tsconfig.json', 'vite.config.*', '*.config.*'],
    'config': ['*.json', '*.yml', '*.yaml', '*.toml']
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
 * 获取Git状态
 */
function getGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('获取Git状态失败:', error.message);
    return [];
  }
}

/**
 * 获取Git差异
 */
function getGitDiff() {
  try {
    const diff = execSync('git diff --cached', { encoding: 'utf8' });
    return diff;
  } catch (error) {
    console.error('获取Git差异失败:', error.message);
    return '';
  }
}

/**
 * 获取最近提交
 */
function getRecentCommits(count = 5) {
  try {
    const commits = execSync(`git log --oneline -${count}`, { encoding: 'utf8' });
    return commits.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('获取提交记录失败:', error.message);
    return [];
  }
}

/**
 * 检测文件变更类型
 */
function detectFileChangeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const dir = path.dirname(filePath);

  // 根据文件路径和扩展名判断变更类型
  if (filePath.includes('docs/') || ext === '.md') {
    return 'documentation';
  }

  if (filePath.includes('test') || ext.includes('test') || ext.includes('spec')) {
    return 'test';
  }

  if (['.css', '.scss', '.less'].includes(ext)) {
    return 'style';
  }

  if (['.json', '.yml', '.yaml', '.toml'].includes(ext)) {
    return 'build';
  }

  if (['.vue', '.ts', '.js'].includes(ext) && filePath.includes('src/')) {
    return 'feature';
  }

  return 'improvement';
}

/**
 * 分析变更内容
 */
function analyzeChangeContent(filePath, diffContent) {
  const changeType = detectFileChangeType(filePath);
  const fileName = path.basename(filePath);

  // 简单的关键词分析
  const keywords = CONFIG.changeTypes[changeType]?.keywords || [];
  const foundKeywords = keywords.filter(keyword =>
    diffContent.toLowerCase().includes(keyword.toLowerCase())
  );

  return {
    type: changeType,
    fileName,
    keywords: foundKeywords,
    confidence: foundKeywords.length > 0 ? 0.8 : 0.5
  };
}

/**
 * 生成变更条目描述
 */
function generateChangeDescription(changeAnalysis) {
  const { type, fileName, keywords } = changeAnalysis;
  const typeInfo = CONFIG.changeTypes[type];

  let description = '';

  // 根据变更类型生成描述
  switch (type) {
    case 'feature':
      description = `添加${fileName}相关功能`;
      break;
    case 'fix':
      description = `修复${fileName}相关问题`;
      break;
    case 'improvement':
      description = `改进${fileName}功能`;
      break;
    case 'documentation':
      description = `更新${fileName}文档`;
      break;
    case 'style':
      description = `调整${fileName}样式`;
      break;
    case 'test':
      description = `添加${fileName}测试`;
      break;
    case 'build':
      description = `更新${fileName}配置`;
      break;
    case 'security':
      description = `增强${fileName}安全性`;
      break;
    default:
      description = `更新${fileName}`;
  }

  // 如果有关键词，尝试生成更具体的描述
  if (keywords.length > 0) {
    const mainKeyword = keywords[0];
    description = description.replace(/更新|添加|修复|改进/, mainKeyword);
  }

  return {
    description,
    type,
    typeInfo,
    confidence: changeAnalysis.confidence
  };
}

/**
 * 扫描项目变更
 */
function scanProjectChanges() {
  console.log('🔍 扫描项目变更...');

  const gitStatus = getGitStatus();
  const changes = [];

  for (const statusLine of gitStatus) {
    const [status, filePath] = statusLine.split(/\s+/, 2);

    if (!filePath) continue;

    // 跳过不需要的文件
    if (filePath.includes('node_modules/') || filePath.includes('.git/')) {
      continue;
    }

    const changeAnalysis = analyzeChangeContent(filePath, '');
    const changeDescription = generateChangeDescription(changeAnalysis);

    changes.push({
      file: filePath,
      status: status,
      type: changeDescription.type,
      description: changeDescription.description,
      confidence: changeDescription.confidence,
      typeInfo: changeDescription.typeInfo
    });
  }

  return changes;
}

/**
 * 自动检测变更类型
 */
function autoDetectChanges() {
  console.log('🤖 自动检测变更类型...');

  const changes = scanProjectChanges();

  if (changes.length === 0) {
    console.log('📝 未检测到变更');
    return [];
  }

  // 按类型分组
  const groupedChanges = {};

  for (const change of changes) {
    const type = change.type;
    if (!groupedChanges[type]) {
      groupedChanges[type] = [];
    }
    groupedChanges[type].push(change);
  }

  // 生成汇总报告
  console.log('\n📊 变更检测结果:');
  for (const [type, typeChanges] of Object.entries(groupedChanges)) {
    const typeInfo = CONFIG.changeTypes[type];
    console.log(`\n${typeInfo.icon} ${typeInfo.title} (${typeChanges.length}项):`);

    for (const change of typeChanges) {
      console.log(`  - ${change.description} (${change.file})`);
    }
  }

  return groupedChanges;
}

/**
 * 添加变更条目到CHANGELOG
 */
function addChangeEntryToChangelog(changeType, description, files = []) {
  console.log(`➕ 添加变更条目: ${description}`);

  try {
    const changelogContent = fs.readFileSync(CONFIG.changelogPath, 'utf8');
    const timestamp = getCurrentTimestamp();

    // 查找当前版本部分
    const versionMatch = changelogContent.match(/### \[v(\d+\.\d+\.\d+)\]/);
    if (!versionMatch) {
      console.error('❌ 无法找到当前版本');
      return false;
    }

    const currentVersion = versionMatch[1];
    const versionPattern = new RegExp(`(### \\[v${currentVersion.replace(/\./g, '\\.')}\\] - [^\\n]+\\n\\n)`);
    const versionMatch2 = changelogContent.match(versionPattern);

    if (!versionMatch2) {
      console.error('❌ 无法找到版本部分');
      return false;
    }

    const typeInfo = CONFIG.changeTypes[changeType];
    const entry = `- **${description}** - ${timestamp}\n`;

    // 查找对应类型部分
    const typePattern = new RegExp(`(#### ${typeInfo.icon} ${typeInfo.title}\\n)`);
    const typeMatch = changelogContent.match(typePattern);

    if (typeMatch) {
      // 在现有类型部分添加条目
      const insertIndex = typeMatch.index + typeMatch[0].length;
      const newChangelog = changelogContent.slice(0, insertIndex) + entry + changelogContent.slice(insertIndex);
      fs.writeFileSync(CONFIG.changelogPath, newChangelog, 'utf8');
    } else {
      // 创建新的类型部分
      const versionInsertIndex = versionMatch2.index + versionMatch2[0].length;
      const newTypeSection = `#### ${typeInfo.icon} ${typeInfo.title}\n${entry}\n`;
      const newChangelog = changelogContent.slice(0, versionInsertIndex) + newTypeSection + changelogContent.slice(versionInsertIndex);
      fs.writeFileSync(CONFIG.changelogPath, newChangelog, 'utf8');
    }

    console.log('✅ 变更条目已添加到CHANGELOG');
    return true;

  } catch (error) {
    console.error('❌ 添加变更条目失败:', error.message);
    return false;
  }
}

/**
 * 自动添加变更条目
 */
function autoAddChangeEntries() {
  console.log('🚀 自动添加变更条目...');

  const groupedChanges = autoDetectChanges();

  if (Object.keys(groupedChanges).length === 0) {
    console.log('📝 没有变更需要添加');
    return;
  }

  let addedCount = 0;

  for (const [changeType, changes] of Object.entries(groupedChanges)) {
    const typeInfo = CONFIG.changeTypes[changeType];

    // 生成汇总描述
    const fileCount = changes.length;
    const summaryDescription = fileCount > 1
      ? `${typeInfo.title} (${fileCount}个文件)`
      : changes[0].description;

    // 添加条目
    if (addChangeEntryToChangelog(changeType, summaryDescription, changes.map(c => c.file))) {
      addedCount++;
    }
  }

  console.log(`\n✅ 成功添加 ${addedCount} 个变更条目`);
}

/**
 * 手动添加变更条目
 */
function manualAddChangeEntry(type, description, files = []) {
  console.log(`➕ 手动添加变更条目...`);

  if (!CONFIG.changeTypes[type]) {
    console.error(`❌ 不支持的变更类型: ${type}`);
    console.log('支持的类型:', Object.keys(CONFIG.changeTypes).join(', '));
    return false;
  }

  return addChangeEntryToChangelog(type, description, files);
}

/**
 * 交互式添加变更条目
 */
function interactiveAddChangeEntry() {
  console.log('🎯 交互式添加变更条目...\n');

  // 显示可用类型
  console.log('可用的变更类型:');
  for (const [type, info] of Object.entries(CONFIG.changeTypes)) {
    console.log(`  ${type}: ${info.icon} ${info.title}`);
  }

  console.log('\n请选择变更类型和描述 (示例: feature "添加用户登录功能")');
  console.log('输入 "exit" 退出');

  // 这里可以添加更复杂的交互逻辑
  console.log('💡 提示: 使用 --type 和 --description 参数进行非交互式添加');
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
InkDot 自动变更条目工具

用法: node docs/tools/change-entry-helper.js <command> [options]

命令:
  auto                    自动检测并添加变更条目 (默认)
  detect                  仅检测变更类型，不添加条目
  add                     手动添加变更条目
  scan                    扫描项目变更
  interactive             交互式添加变更条目
  help                    显示帮助信息

选项:
  --type <type>           指定变更类型
  --description <desc>    指定变更描述
  --files <files>         指定相关文件 (逗号分隔)
  --confidence <level>    设置置信度阈值 (0.0-1.0)

支持的变更类型:
  feature     🆕 新增功能
  fix         🐛 问题修复
  improvement ⚡ 功能改进
  documentation 📝 文档更新
  style       🎨 样式调整
  test        ✅ 测试相关
  build       🏗️ 构建配置
  security    🔒 安全相关

示例:
  node docs/tools/change-entry-helper.js auto
  node docs/tools/change-entry-helper.js add --type feature --description "添加用户认证"
  node docs/tools/change-entry-helper.js detect
  node docs/tools/change-entry-helper.js interactive
  `);
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'auto';

  // 解析参数
  const options = {};
  for (let i = 1; i < args.length; i += 2) {
    if (args[i].startsWith('--')) {
      options[args[i].substring(2)] = args[i + 1];
    }
  }

  switch (command) {
    case 'auto':
      autoAddChangeEntries();
      break;

    case 'detect':
      autoDetectChanges();
      break;

    case 'add':
      if (!options.type || !options.description) {
        console.error('❌ 需要指定 --type 和 --description 参数');
        console.log('示例: node change-entry-helper.js add --type feature --description "添加新功能"');
        return;
      }
      const files = options.files ? options.files.split(',') : [];
      manualAddChangeEntry(options.type, options.description, files);
      break;

    case 'scan':
      scanProjectChanges();
      break;

    case 'interactive':
      interactiveAddChangeEntry();
      break;

    case 'help':
    default:
      showHelp();
      break;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  autoDetectChanges,
  autoAddChangeEntries,
  manualAddChangeEntry,
  scanProjectChanges,
  generateChangeDescription,
  getCurrentTimestamp
};
