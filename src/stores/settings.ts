import { ref } from 'vue';
import { defineStore } from 'pinia';
import { voices } from '@/lib/voice';

export const useSettingsStore = defineStore('settings', () => {
  const voiceList = voices.filter((v) => v.lang === 'ru-RU').map((v) => ({
    name: v.name,
    id: v.voiceURI,
  }));
  const voice = ref(voiceList.length ? voiceList[0] : undefined);

  const isVoiceEnabled = ref(voiceList.length > 0);
  const isRecognitionEnabled = ref();
  const isSettingsOpened = ref(false);
  const answerDelay = ref(3000);
  const pauseDelay = ref(3000);
  const answerCount = ref(10);

  return {
    voice,
    voiceList,
    answerDelay,
    pauseDelay,
    answerCount,
    isVoiceEnabled,
    isRecognitionEnabled,
    isSettingsOpened,
  };
}, { persist: true });
