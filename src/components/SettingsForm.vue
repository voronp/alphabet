<template>
  <div class="settings">
    <div class="grid">
      <div class="col-6">
        Звук
      </div>
      <div class="col-6">
        <InputSwitch v-model="settingsStore.isVoiceEnabled" :disabled="!settingsStore.isVoiceAvailable" />
      </div>
      <div class="col-12">
        <label for="settings-voice">Голос</label>
        <Dropdown
          id="settings-voice"
          v-model="settingsStore.voice"
          :options="settingsStore.voiceOptions"
          optionLabel="name"
          option-value="id"
          class="w-full"
        >
        </Dropdown>
      </div>
      <div class="col-6">
        Распознавание
      </div>
      <div class="col-6">
        <InputSwitch v-model="settingsStore.isRecognitionEnabled" :disabled="!settingsStore.isRecognitionAvailable" />
      </div>
      <div class="col-12">
        <label for="settings-answer-count">Количество вопросов</label>
        <InputText id="settings-answer-count" v-model.number="answerCountText" class="w-full" />
        <Slider
          :min="5"
          :max="50"
          :step="1"
          v-model="settingsStore.answerCount"
          class="w-full"
        >
        </Slider>
      </div>
      <div class="col-12">
        <label for="settings-answer-delay">Время на ответ</label>
        <InputText id="settings-answer-delay" v-model.number="answerDelayText" class="w-full" />
        <Slider
          :min="1000"
          :max="30000"
          :step="1000"
          v-model="settingsStore.answerDelay"
          class="w-full"
        >
        </Slider>
      </div>
      <div class="col-12">
        <label for="settings-pause-delay">Пауза после ответа</label>
        <InputText id="settings-pause-delay" v-model.number="pauseDelayText" class="w-full" />
        <Slider
          :min="0"
          :max="3000"
          :step="500"
          v-model="settingsStore.pauseDelay"
          class="w-full"
        >
        </Slider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import Slider from 'primevue/slider';
import InputText from 'primevue/inputtext';

import { computed } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

const answerDelayText = computed({
  set(v:string) {
    settingsStore.answerDelay = Number(v) * 1000;
  },
  get() {
    return String(settingsStore.answerDelay / 1000);
  },
});
const answerCountText = computed({
  set(v:string) {
    settingsStore.answerCount = Number(v);
  },
  get() {
    return String(settingsStore.answerCount);
  },
});
const pauseDelayText = computed({
  set(v:string) {
    settingsStore.pauseDelay = Number(v) * 1000;
  },
  get() {
    return String(settingsStore.pauseDelay / 1000);
  },
});
</script>

<style scoped>

</style>
