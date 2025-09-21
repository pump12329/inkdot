#!/usr/bin/env node

/**
 * InkDot 项目时间戳工具
 * 用于获取和管理项目相对时间戳
 */

const fs = require('fs')

// 项目启动时间 (T0 基准点)
const PROJECT_START_DATE = new Date('2025-09-21T00:00:00Z')

/**
 * 获取当前项目时间戳
 * @param {Date} currentDate - 当前日期，默认为现在
 * @returns {string} 时间戳格式 (如 T1.5)
 */
function getCurrentTimestamp(currentDate = new Date()) {
  const diffTime = currentDate - PROJECT_START_DATE
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffHours === 0) {
    return `T${diffDays}`
  } else {
    return `T${diffDays}.${diffHours}`
  }
}

/**
 * 时间戳转换为日期
 * @param {string} timestamp - 时间戳 (如 T1.5)
 * @returns {Date} 对应的日期
 */
function timestampToDate(timestamp) {
  const match = timestamp.match(/^T(\d+)(?:\.(\d+))?$/)
  if (!match) {
    throw new Error(`无效的时间戳格式: ${timestamp}`)
  }

  const days = parseInt(match[1])
  const hours = parseInt(match[2] || '0')

  const date = new Date(PROJECT_START_DATE)
  date.setDate(date.getDate() + days)
  date.setHours(date.getHours() + hours)

  return date
}

/**
 * 获取下一个审查时间戳
 * @param {string} currentTimestamp - 当前时间戳
 * @param {number} intervalDays - 审查间隔天数 (默认30天)
 * @returns {string} 下次审查时间戳
 */
function getNextReviewTimestamp(currentTimestamp, intervalDays = 30) {
  const match = currentTimestamp.match(/^T(\d+)(?:\.(\d+))?$/)
  if (!match) {
    throw new Error(`无效的时间戳格式: ${currentTimestamp}`)
  }

  const days = parseInt(match[1])
  const hours = parseInt(match[2] || '0')
  const nextDays = days + intervalDays

  return hours > 0 ? `T${nextDays}.${hours}` : `T${nextDays}`
}

/**
 * 格式化时间戳显示
 * @param {string} timestamp - 时间戳
 * @returns {object} 格式化信息
 */
function formatTimestamp(timestamp) {
  const date = timestampToDate(timestamp)
  const match = timestamp.match(/^T(\d+)(?:\.(\d+))?$/)
  const days = parseInt(match[1])
  const hours = parseInt(match[2] || '0')

  return {
    timestamp,
    days,
    hours,
    date: date.toISOString().split('T')[0],
    description: `项目第${days}天${hours > 0 ? `第${hours}小时` : ''}`
  }
}

/**
 * 生成文档头部时间戳信息
 * @param {string} version - 文档版本
 * @param {string} createTimestamp - 创建时间戳
 * @param {string} updateTimestamp - 更新时间戳 (可选)
 * @returns {string} 文档头部信息
 */
function generateDocHeader(version, createTimestamp, updateTimestamp = null) {
  const current = updateTimestamp || getCurrentTimestamp()
  const nextReview = getNextReviewTimestamp(current)

  return `> **文档版本**：${version}  
> **创建时间戳**：${createTimestamp}  
> **最后更新**：${current}  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：${nextReview}`
}

/**
 * 更新文档时间戳
 * @param {string} filePath - 文档文件路径
 * @param {string} newTimestamp - 新的时间戳 (可选)
 */
function updateDocumentTimestamp(filePath, newTimestamp = null) {
  if (!fs.existsSync(filePath)) {
    console.error(`文件不存在: ${filePath}`)
    return
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const timestamp = newTimestamp || getCurrentTimestamp()

  // 更新文档头部的时间戳
  const updatedContent = content.replace(
    /> \*\*最后更新\*\*：T\d+(?:\.\d+)?/,
    `> **最后更新**：${timestamp}`
  )

  // 更新下次审查时间
  const nextReview = getNextReviewTimestamp(timestamp)
  const finalContent = updatedContent.replace(
    /> \*\*下次审查\*\*：T\d+(?:\.\d+)?/,
    `> **下次审查**：${nextReview}`
  )

  fs.writeFileSync(filePath, finalContent)
  console.log(`✅ 已更新文档时间戳: ${filePath} -> ${timestamp}`)
}

/**
 * 命令行工具主函数
 */
function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
  case 'current':
  case 'now': {
    const current = getCurrentTimestamp()
    const info = formatTimestamp(current)
    console.log(`📅 当前项目时间戳: ${current}`)
    console.log(`📋 详细信息: ${info.description}`)
    console.log(`🗓️  对应日期: ${info.date}`)
    break
  }

  case 'convert': {
    const timestamp = args[1]
    if (!timestamp) {
      console.error('❌ 请提供时间戳参数')
      process.exit(1)
    }
    try {
      const converted = formatTimestamp(timestamp)
      console.log(`📅 时间戳: ${converted.timestamp}`)
      console.log(`📋 描述: ${converted.description}`)
      console.log(`🗓️  日期: ${converted.date}`)
    } catch (error) {
      console.error(`❌ ${error.message}`)
      process.exit(1)
    }
    break
  }

  case 'next-review': {
    const baseTimestamp = args[1] || getCurrentTimestamp()
    const interval = parseInt(args[2]) || 30
    const nextReview = getNextReviewTimestamp(baseTimestamp, interval)
    console.log(`📅 基准时间戳: ${baseTimestamp}`)
    console.log(`🔄 审查间隔: ${interval}天`)
    console.log(`📋 下次审查: ${nextReview}`)
    break
  }

  case 'update-doc': {
    const docPath = args[1]
    const newTimestamp = args[2]
    if (!docPath) {
      console.error('❌ 请提供文档路径')
      process.exit(1)
    }
    updateDocumentTimestamp(docPath, newTimestamp)
    break
  }

  case 'header': {
    const version = args[1] || 'v1.0.0'
    const createTs = args[2] || 'T0'
    const updateTs = args[3]
    console.log(generateDocHeader(version, createTs, updateTs))
    break
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

📝 使用示例:
  node timestamp-helper.js current
  node timestamp-helper.js convert T1.5
  node timestamp-helper.js next-review T1.5 30
  node timestamp-helper.js update-doc docs/README.md
  node timestamp-helper.js header v1.0.0 T0 T1.5

🕐 时间戳格式:
  T0      - 项目启动 (2024-12-20)
  T1      - 项目第1天
  T1.5    - 项目第1天第5小时
  T30     - 项目第30天 (1个月)
  T90     - 项目第90天 (3个月)

📋 项目基准时间: ${PROJECT_START_DATE.toISOString().split('T')[0]} (T0)
`)
    break
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

// 导出函数供其他模块使用
module.exports = {
  getCurrentTimestamp,
  timestampToDate,
  getNextReviewTimestamp,
  formatTimestamp,
  generateDocHeader,
  updateDocumentTimestamp,
  PROJECT_START_DATE
}
