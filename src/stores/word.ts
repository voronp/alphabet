import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { vowels, consonants } from '@/lib/grammar';
import { dino, flower, pigs } from '@/data/raw';

export const useWordStore = defineStore('word', () => {
  const vReg = new RegExp(`[${vowels.join(',')}]`, 'g');
  const cReg = new RegExp(`[${consonants.join(',')}]`, 'g');
  const filterWordFn = (word:string, vow:number, con:number[]) => (word.match(vReg) || []).length === vow && con.includes((word.match(cReg) || []).length);
  const text = ref('');
  const vowelCount = ref(1);
  const consonantCount = ref([1]);
  let unique:Record<string, boolean> = {};
  let repeated = 0;

  const matchingWords = computed(() => [
    ...pigs.filter((w) => filterWordFn(w, vowelCount.value, consonantCount.value)),
    ...flower.filter((w) => filterWordFn(w, vowelCount.value, consonantCount.value)),
    ...dino.filter((w) => filterWordFn(w, vowelCount.value, consonantCount.value)),
  ]);

  const setParams = (v:number, c:number[]) => {
    vowelCount.value = v;
    consonantCount.value = c;
  };

  const updateText = ():void => {
    if (!matchingWords.value.length) {
      text.value = '-';
      return;
    }
    const index = Math.floor(Math.random() * matchingWords.value.length);
    text.value = matchingWords.value[index];
    if (unique[text.value]) {
      repeated += 1;
      if (repeated <= 10) return updateText();
    }
    unique[text.value] = true;
    repeated = 0;
  };

  const resetUnique = () => {
    unique = {};
  };

  return {
    text,
    updateText,
    setParams,
    resetUnique,
    matchingWords,
  };
});
