import { ref } from 'vue';

export const useRecognition = () => {
  let target = '';
  const isMatched = ref(false);
  const setTarget = (t:string) => {
    target = t;
    isMatched.value = false;
  };
  const tryRecognize = (rec:SpeechRecognitionEvent):boolean => {
    console.log(target, '---->');
    [...rec.results].forEach((r) => [...r].forEach((t) => console.log(t.transcript.trim().toLowerCase())));
    isMatched.value = isMatched.value || [...rec.results].some((r) => [...r].some((t) => t.transcript.trim().toLowerCase() === target));
    return isMatched.value;
  };

  return {
    isMatched,
    setTarget,
    tryRecognize,
  };
};
