<template>
  <svg 
    :class="logoClasses" 
    :width="size" 
    :height="size" 
    viewBox="0 0 120 120" 
    xmlns="http://www.w3.org/2000/svg"
    @click="handleClick"
  >
    <defs>
      <!-- 中心点渐变 -->
      <radialGradient :id="`centerGradient-${instanceId}`" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
        <stop offset="70%" style="stop-color:#333333;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#666666;stop-opacity:1" />
      </radialGradient>
      
      <!-- 连接线渐变 -->
      <linearGradient :id="`lineGradient-${instanceId}`" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#0066FF;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#00FFFF;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0066FF;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- 连接线组 -->
    <g id="connections" :stroke="`url(#lineGradient-${instanceId})`" stroke-width="2" fill="none">
      <line x1="60" y1="60" x2="60" y2="24" />           <!-- 上 -->
      <line x1="60" y1="60" x2="85.5" y2="34.5" />       <!-- 右上 -->
      <line x1="60" y1="60" x2="96" y2="60" />            <!-- 右 -->
      <line x1="60" y1="60" x2="85.5" y2="85.5" />       <!-- 右下 -->
      <line x1="60" y1="60" x2="60" y2="96" />            <!-- 下 -->
      <line x1="60" y1="60" x2="34.5" y2="85.5" />       <!-- 左下 -->
      <line x1="60" y1="60" x2="24" y2="60" />            <!-- 左 -->
      <line x1="60" y1="60" x2="34.5" y2="34.5" />       <!-- 左上 -->
    </g>
    
    <!-- 墨点组 -->
    <g id="dots">
      <!-- 外围墨点 -->
      <circle cx="60" cy="24" r="5" fill="#333333" />     <!-- 上 -->
      <circle cx="85.5" cy="34.5" r="5" fill="#333333" /> <!-- 右上 -->
      <circle cx="96" cy="60" r="5" fill="#333333" />     <!-- 右 -->
      <circle cx="85.5" cy="85.5" r="5" fill="#333333" /> <!-- 右下 -->
      <circle cx="60" cy="96" r="5" fill="#333333" />     <!-- 下 -->
      <circle cx="34.5" cy="85.5" r="5" fill="#333333" /> <!-- 左下 -->
      <circle cx="24" cy="60" r="5" fill="#333333" />     <!-- 左 -->
      <circle cx="34.5" cy="34.5" r="5" fill="#333333" /> <!-- 左上 -->
      
      <!-- 中心墨点 -->
      <circle cx="60" cy="60" r="9" :fill="`url(#centerGradient-${instanceId})`" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'InkDotLogo',
  props: {
    // 尺寸大小
    size: {
      type: [String, Number],
      default: 120,
      validator: (value) => {
        const num = parseInt(value);
        return num >= 32 && num <= 500;
      }
    },
    // 尺寸变体
    variant: {
      type: String,
      default: 'lg',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    // 动画类型
    animation: {
      type: String,
      default: '',
      validator: (value) => ['', 'birth', 'loading', 'glow', 'pulse'].includes(value)
    },
    // 是否可点击
    clickable: {
      type: Boolean,
      default: false
    },
    // 自定义CSS类
    customClass: {
      type: String,
      default: ''
    },
    // 是否启用悬停效果
    hoverable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      instanceId: Math.random().toString(36).substr(2, 9)
    }
  },
  computed: {
    logoClasses() {
      const classes = ['logo'];
      
      // 添加尺寸类
      if (this.variant !== 'lg') {
        classes.push(`logo-${this.variant}`);
      }
      
      // 添加动画类
      if (this.animation) {
        classes.push(`animate-${this.animation}`);
      }
      
      // 添加自定义类
      if (this.customClass) {
        classes.push(this.customClass);
      }
      
      // 添加可点击类
      if (this.clickable) {
        classes.push('clickable');
      }
      
      // 添加悬停类
      if (this.hoverable) {
        classes.push('hoverable');
      }
      
      return classes.join(' ');
    }
  },
  methods: {
    handleClick(event) {
      if (this.clickable) {
        this.$emit('click', event);
      }
    }
  }
}
</script>

<style scoped>
.logo {
  display: inline-block;
  transition: all 0.3s ease;
  cursor: default;
}

.logo.clickable {
  cursor: pointer;
}

.logo.hoverable:hover {
  animation: nebulaPulse 2s ease-in-out infinite;
}

/* 尺寸变体 */
.logo-xl { width: 200px; height: 200px; }
.logo-lg { width: 120px; height: 120px; }
.logo-md { width: 80px; height: 80px; }
.logo-sm { width: 48px; height: 48px; }
.logo-xs { width: 32px; height: 32px; }

/* 动画效果 */
@keyframes nebulaBirth {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  25% {
    transform: scale(0.3) rotate(90deg);
    opacity: 0.3;
  }
  50% {
    transform: scale(0.7) rotate(180deg);
    opacity: 0.7;
  }
  75% {
    transform: scale(1.1) rotate(270deg);
    opacity: 0.9;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

.animate-birth {
  animation: nebulaBirth 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes nebulaPulse {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.08);
    filter: brightness(1.2);
  }
}

@keyframes nebulaRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-loading {
  animation: nebulaRotate 2s linear infinite;
}

@keyframes dotFlicker {
  0%, 90%, 100% { opacity: 1; }
  45%, 55% { opacity: 0.4; }
}

.animate-loading #dots circle:nth-child(odd) {
  animation: dotFlicker 1.5s ease-in-out infinite;
}

.animate-loading #dots circle:nth-child(even) {
  animation: dotFlicker 1.5s ease-in-out infinite 0.75s;
}

@keyframes lineGlow {
  0%, 100% {
    stroke-width: 2px;
    filter: drop-shadow(0 0 0 transparent);
  }
  50% {
    stroke-width: 3px;
    filter: drop-shadow(0 0 8px #00FFFF);
  }
}

.animate-glow #connections line {
  animation: lineGlow 3s ease-in-out infinite;
}

@keyframes nebulaExpand {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1.2);
  }
}

.logo:active {
  animation: nebulaExpand 0.3s ease-out;
}
</style>
