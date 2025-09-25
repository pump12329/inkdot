import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

console.log('main.ts loaded');

const app = createApp(App);
console.log('Vue app created');

app.use(createPinia());
console.log('Pinia added');

app.mount('#app');
console.log('Vue app mounted');
