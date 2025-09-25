// Vue 3 类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 全局类型声明
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

// Vue 3 运行时类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $emit: (event: string, ...args: any[]) => void;
  }
}

// 环境变量类型
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_STORAGE_PREFIX: string;
  readonly VITE_ENABLE_AI_FEATURES: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_ENABLE_CONSOLE_LOGS: string;
  readonly VITE_DEFAULT_THEME: string;
  readonly VITE_DEEPSEEK_API_KEY: string;
  readonly VITE_DEEPSEEK_BASE_URL: string;
  readonly VITE_ENABLE_DEEPSEEK: string;
  readonly VITE_OPENROUTER_API_KEY: string;
  readonly VITE_OPENROUTER_BASE_URL: string;
  readonly VITE_ENABLE_OPENROUTER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
