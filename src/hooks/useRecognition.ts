import { ref } from 'vue';

export const useRecognition = () => {
  let target = '';
  const isMatched = ref(false);
  const setTarget = (t:string) => {
    target = t;
    isMatched.value = false;
  };
  const tryRecognize = (rec:SpeechRecognitionEvent):boolean => {
    isMatched.value = isMatched.value || [...rec.results].some((r) => [...r].some((t) => t.transcript === target));
    return isMatched.value;
  };

  return {
    isMatched,
    setTarget,
    tryRecognize,
  };
};