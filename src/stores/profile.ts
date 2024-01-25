import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface ResultItem {
  datetime: Date;
  type: string;
  totalItems: number;
  successItems: number;
}

export const useProfileStore = defineStore('profile', () => {
  const resultItems:ResultItem[] = [];
  const userName = ref('');

  return {
    resultItems,
    userName,
  };
}, { persist: true });
