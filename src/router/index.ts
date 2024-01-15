import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/syllable',
      name: 'syllable',
      component: () => import('../views/SyllableView.vue'),
    },
    {
      path: '/word/:vowels/:consonants?',
      name: 'word',
      component: () => import('../views/WordView.vue'),
    },
  ],
});

export default router;
