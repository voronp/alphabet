import { ref } from 'vue';
import { defineStore } from 'pinia';
import { voices } from '@/lib/voice';

export interface ResultItem {
  datetime: Date;
  type: string;
  totalItems: number;
  successItems: number;
}

export const useTrainingsStore = defineStore('trainings', () => {
  const resultItems:ResultItem[] = [];

  return {
    resultItems,
  };
}, { persist: true });
