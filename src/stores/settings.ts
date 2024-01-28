import {
  computed, ref, watch, nextTick, 
} from 'vue';
import { defineStore } from 'pinia';
import { getVoices, setVoice } from '@/lib/voice';
import { recognition } from '@/lib/recognition';

export const useSettingsStore = defineStore('settings', () => {
  const voices = ref<SpeechSynthesisVoice[]>([]);
  const voiceOptions = computed(() => voices.value.filter((v) => v.lang === 'ru' || v.lang === 'ru-RU').map((v) => ({
    name: v.name,
    id: v.voiceURI,
  })));

  const voice = ref<string>();
  
  const voiceObject = computed(() => (voice.value ? voices.value.find((voiceItem) => voiceItem.voiceURI === voice.value) : undefined));

  const isVoiceAvailable = computed(() => voiceOptions.value.length > 0);
  const isVoiceEnabled = ref();
  const isRecognitionAvailable = ref(!!recognition);
  const isRecognitionEnabled = ref();
  const isSettingsOpened = ref(false);
  const answerDelay = ref(3000);
  const pauseDelay = ref(3000);
  const answerCount = ref(10);

  const loadVoices = async () => {
    voices.value = await getVoices();
    nextTick(() => {
      if (voiceOptions.value.length) {
        voice.value = voiceOptions.value.find((v) => v.name.includes('female'))?.id || voiceOptions.value[0].id;
        if (isVoiceEnabled.value === undefined) { isVoiceEnabled.value = true; }
      }
    });
  };

  watch(voiceObject, (v) => {
    if (v) {
      setVoice(v);
    }
  }, { immediate: true });

  return {
    voice,
    voiceOptions,
    answerDelay,
    pauseDelay,
    answerCount,
    isVoiceAvailable,
    isVoiceEnabled,
    isRecognitionAvailable,
    isRecognitionEnabled,
    isSettingsOpened,
    loadVoices,
  };
}, { persist: true });
