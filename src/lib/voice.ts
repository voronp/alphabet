export const voices = window.speechSynthesis.getVoices();
export const speech = new SpeechSynthesisUtterance();

speech.lang = 'ru-RU';
speech.rate = 1;
speech.pitch = 1;

export const setVoice = (v:SpeechSynthesisVoice) => {
  speech.voice = v;
};

export const setText = (v:string) => {
  speech.text = v;
};

export const speak = () => {
  window.speechSynthesis.speak(speech);
};

export const pause = () => {
  window.speechSynthesis.pause();
};

export const resume = () => {
  window.speechSynthesis.resume();
};

export const cancel = () => {
  window.speechSynthesis.cancel();
};
