import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getSyllable } from '@/lib/grammar';

export const useSyllableStore = defineStore('syllable', () => {
  const text = ref('');
  const updateText = () => {
    text.value = getSyllable();
  };
  return {
    text,
    updateText,
  };
}, { persist: true });
