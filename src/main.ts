import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// 导入样式
import './assets/styles/index.css';

console.log('main.ts loaded');

const app = createApp(App);
console.log('Vue app created');

app.use(createPinia());
console.log('Pinia added');

app.mount('#app');
console.log('Vue app mounted');
