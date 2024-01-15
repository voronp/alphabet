import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/lara-light-green/theme.css';
import 'primeicons/primeicons.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(PrimeVue, { ripple: true });
pinia.use(piniaPluginPersistedstate);

app.mount('#app');
