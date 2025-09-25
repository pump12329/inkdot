#!/usr/bin/env node

/**
 * InkDot CHANGELOG 自动更新工具
 *
 * 功能：
 * - 自动解析Git提交记录
 * - 根据提交类型生成CHANGELOG条目
 * - 支持版本号管理
 * - 自动更新时间戳
 *
 * 使用方法：
 * node docs/tools/changelog-helper.js [command] [options]
 *
 * 命令：
 * - update: 更新CHANGELOG
 * - add: 手动添加条目
 * - version: 管理版本号
 * - status: 查看当前状态
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置文件
const CONFIG = {
  changelogPath: 'docs/CHANGELOG.md',
  projectStartDate: '2025-09-21',
  maxCommits: 50,
  excludePatterns: [/^docs?:/i, /^chore:/i, /^style:/i, /^refactor:/i]
};

// 提交类型映射
const COMMIT_TYPE_MAP = {
  feat: { icon: '🆕', title: '新增', category: 'features' },
  fix: { icon: '🐛', title: '修复', category: 'bugfixes' },
  docs: { icon: '📝', title: '文档', category: 'documentation' },
  style: { icon: '🎨', title: '样式', category: 'styling' },
  refactor: { icon: '♻️', title: '重构', category: 'refactoring' },
  perf: { icon: '⚡', title: '性能', category: 'performance' },
  test: { icon: '✅', title: '测试', category: 'testing' },
  build: { icon: '🏗️', title: '构建', category: 'build' },
  ci: { icon: '👷', title: 'CI', category: 'ci' },
  chore: { icon: '🔧', title: '维护', category: 'maintenance' },
  revert: { icon: '⏪', title: '回滚', category: 'revert' }
};

// 文档类型映射
const DOC_TYPE_MAP = {
  architecture: { icon: '🏗️', title: '架构文档' },
  development: { icon: '🛠️', title: '开发文档' },
  design: { icon: '🎨', title: '设计文档' },
  api: { icon: '📡', title: 'API文档' },
  'user-guide': { icon: '📖', title: '用户指南' },
  deployment: { icon: '🚀', title: '部署文档' },
  tools: { icon: '🔧', title: '工具文档' }
};

/**
 * 获取当前时间戳
 */
function getCurrentTimestamp() {
  const now = new Date();
  const startDate = new Date(CONFIG.projectStartDate);
  const diffTime = now - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `T${diffDays}.${diffHours}`;
}

/**
 * 获取Git提交记录
 */
function getGitCommits(since = null) {
  try {
    let cmd = `git log --oneline --no-merges --max-count=${CONFIG.maxCommits}`;
    if (since) {
      cmd += ` --since="${since}"`;
    }

    const output = execSync(cmd, { encoding: 'utf8' });
    return output
      .trim()
      .split('\n')
      .filter(line => line.trim());
  } catch (error) {
    console.error('获取Git提交记录失败:', error.message);
    return [];
  }
}

/**
 * 解析提交消息
 */
function parseCommitMessage(commitLine) {
  const match = commitLine.match(/^([a-f0-9]{7})\s+(.+)$/);
  if (!match) return null;

  const [, hash, message] = match;

  // 解析提交类型和消息
  const typeMatch = message.match(/^([^:]+):\s*(.+)$/);
  if (!typeMatch) return null;

  const [, type, description] = typeMatch;
  const typeInfo = COMMIT_TYPE_MAP[type] || { icon: '📝', title: '其他', category: 'other' };

  return {
    hash: hash.substring(0, 7),
    type,
    description: description.trim(),
    typeInfo
  };
}

/**
 * 读取CHANGELOG文件
 */
function readChangelog() {
  try {
    return fs.readFileSync(CONFIG.changelogPath, 'utf8');
  } catch (error) {
    console.error('读取CHANGELOG文件失败:', error.message);
    return '';
  }
}

/**
 * 写入CHANGELOG文件
 */
function writeChangelog(content) {
  try {
    fs.writeFileSync(CONFIG.changelogPath, content, 'utf8');
    console.log('✅ CHANGELOG已更新');
  } catch (error) {
    console.error('写入CHANGELOG文件失败:', error.message);
  }
}

/**
 * 解析当前版本号
 */
function getCurrentVersion(changelogContent) {
  const versionMatch = changelogContent.match(/### \[v(\d+\.\d+\.\d+)\]/);
  return versionMatch ? versionMatch[1] : '1.0.0';
}

/**
 * 获取下一个版本号
 */
function getNextVersion(currentVersion, changeType = 'patch') {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (changeType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

/**
 * 分析提交记录确定版本类型
 */
function analyzeVersionType(commits) {
  let hasBreaking = false;
  let hasFeatures = false;
  let hasFixes = false;

  for (const commit of commits) {
    if (commit.description.includes('BREAKING CHANGE') || commit.description.includes('!')) {
      hasBreaking = true;
    }
    if (commit.type === 'feat') {
      hasFeatures = true;
    }
    if (commit.type === 'fix') {
      hasFixes = true;
    }
  }

  if (hasBreaking) return 'major';
  if (hasFeatures) return 'minor';
  if (hasFixes) return 'patch';
  return 'patch';
}

/**
 * 按类型分组提交
 */
function groupCommitsByType(commits) {
  const groups = {};

  for (const commit of commits) {
    const category = commit.typeInfo.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(commit);
  }

  return groups;
}

/**
 * 生成版本条目内容
 */
function generateVersionEntry(version, timestamp, commitGroups) {
  let content = `### [v${version}] - ${timestamp}\n\n`;

  // 按优先级排序类别
  const categoryOrder = [
    'features',
    'bugfixes',
    'documentation',
    'refactoring',
    'performance',
    'testing',
    'build',
    'ci',
    'maintenance',
    'revert',
    'other'
  ];

  for (const category of categoryOrder) {
    if (commitGroups[category] && commitGroups[category].length > 0) {
      const typeInfo = COMMIT_TYPE_MAP[commitGroups[category][0].type] || {
        icon: '📝',
        title: '其他'
      };
      content += `#### ${typeInfo.icon} ${typeInfo.title}\n`;

      for (const commit of commitGroups[category]) {
        content += `- **${commit.description}** - [${commit.hash}]\n`;
      }
      content += '\n';
    }
  }

  content += '---\n\n';
  return content;
}

/**
 * 更新CHANGELOG
 */
function updateChangelog(options = {}) {
  console.log('🔄 开始更新CHANGELOG...');

  // 获取提交记录
  const since = options.since || null;
  const rawCommits = getGitCommits(since);

  if (rawCommits.length === 0) {
    console.log('📝 没有新的提交记录');
    return;
  }

  // 解析提交记录
  const commits = rawCommits
    .map(parseCommitMessage)
    .filter(
      commit => commit && !CONFIG.excludePatterns.some(pattern => pattern.test(commit.description))
    )
    .slice(0, 20); // 限制条目数量

  if (commits.length === 0) {
    console.log('📝 没有符合条件的提交记录');
    return;
  }

  console.log(`📊 找到 ${commits.length} 条符合条件的提交记录`);

  // 读取当前CHANGELOG
  const changelogContent = readChangelog();
  const currentVersion = getCurrentVersion(changelogContent);

  // 确定新版本号
  const versionType = analyzeVersionType(commits);
  const newVersion = getNextVersion(currentVersion, versionType);
  const timestamp = getCurrentTimestamp();

  console.log(`📈 版本更新: ${currentVersion} → ${newVersion} (${versionType})`);

  // 生成新版本条目
  const commitGroups = groupCommitsByType(commits);
  const versionEntry = generateVersionEntry(newVersion, timestamp, commitGroups);

  // 插入新版本条目到变更记录部分
  const changeRecordIndex = changelogContent.indexOf('## 📅 变更记录');
  if (changeRecordIndex === -1) {
    console.error('❌ 无法找到变更记录部分');
    return;
  }

  const insertIndex = changeRecordIndex + '## 📅 变更记录\n\n'.length;
  const newChangelog =
    changelogContent.slice(0, insertIndex) + versionEntry + changelogContent.slice(insertIndex);

  // 更新文档头部信息
  const updatedChangelog = newChangelog.replace(
    /^> \*\*最后更新\*\*：T[\d.]+/m,
    `> **最后更新**：${timestamp}`
  );

  // 写入文件
  writeChangelog(updatedChangelog);

  console.log('✅ CHANGELOG更新完成');
}

/**
 * 手动添加条目
 */
function addEntry(type, description, version = null) {
  console.log('➕ 手动添加CHANGELOG条目...');

  const changelogContent = readChangelog();
  const currentVersion = version || getCurrentVersion(changelogContent);
  const timestamp = getCurrentTimestamp();

  const entry = `- **${description}** - ${timestamp}\n`;

  // 查找对应版本部分并添加条目
  const versionPattern = new RegExp(
    `(### \\[v${currentVersion.replace(/\./g, '\\.')}\\] - [^\\n]+\\n\\n)`
  );
  const match = changelogContent.match(versionPattern);

  if (!match) {
    console.error('❌ 未找到对应版本部分');
    return;
  }

  const insertIndex = match.index + match[0].length;
  const newChangelog =
    changelogContent.slice(0, insertIndex) + entry + changelogContent.slice(insertIndex);

  writeChangelog(newChangelog);
  console.log('✅ 条目添加完成');
}

/**
 * 查看当前状态
 */
function showStatus() {
  console.log('📊 CHANGELOG当前状态:');

  const changelogContent = readChangelog();
  const currentVersion = getCurrentVersion(changelogContent);
  const timestamp = getCurrentTimestamp();

  console.log(`📋 当前版本: v${currentVersion}`);
  console.log(`⏰ 当前时间戳: ${timestamp}`);
  console.log(`📁 CHANGELOG路径: ${CONFIG.changelogPath}`);

  // 显示最近的提交记录
  const recentCommits = getGitCommits().slice(0, 5);
  console.log('\n📝 最近5条提交记录:');
  recentCommits.forEach((commit, index) => {
    console.log(`  ${index + 1}. ${commit}`);
  });
}

/**
 * 批量更新文档状态表
 */
function updateDocumentStatusTable() {
  console.log('📊 更新文档状态表...');

  const changelogContent = readChangelog();
  const timestamp = getCurrentTimestamp();

  // 查找文档状态表部分
  const statusTableIndex = changelogContent.indexOf('### 🟢 当前文档 (CURRENT)');
  if (statusTableIndex === -1) {
    console.log('⚠️ 未找到文档状态表');
    return;
  }

  // 这里可以添加自动扫描文档并更新状态表的逻辑
  console.log('✅ 文档状态表更新完成');
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'update';

  switch (command) {
    case 'update': {
      const since = args.includes('--since') ? args[args.indexOf('--since') + 1] : null;
      updateChangelog({ since });
      break;
    }

    case 'add': {
      if (args.length < 3) {
        console.log('用法: node changelog-helper.js add <type> <description> [version]');
        console.log('类型: feat, fix, docs, style, refactor, perf, test, build, ci, chore');
        return;
      }
      const type = args[1];
      const description = args[2];
      const version = args[3] || null;
      addEntry(type, description, version);
      break;
    }

    case 'version': {
      const versionType = args[1] || 'patch';
      console.log(`📈 版本类型: ${versionType}`);
      // 这里可以实现版本号管理逻辑
      break;
    }

    case 'status':
      showStatus();
      break;

    case 'help':
    default:
      console.log(`
InkDot CHANGELOG 自动更新工具

用法: node docs/tools/changelog-helper.js <command> [options]

命令:
  update [--since <date>]  更新CHANGELOG (默认)
  add <type> <description> [version]  手动添加条目
  version <type>           管理版本号 (major|minor|patch)
  status                   查看当前状态
  help                     显示帮助信息

选项:
  --since <date>           只处理指定日期之后的提交

示例:
  node docs/tools/changelog-helper.js update
  node docs/tools/changelog-helper.js add feat "添加新功能"
  node docs/tools/changelog-helper.js version minor
  node docs/tools/changelog-helper.js status
      `);
      break;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  updateChangelog,
  addEntry,
  showStatus,
  getCurrentTimestamp,
  getGitCommits,
  parseCommitMessage
};
