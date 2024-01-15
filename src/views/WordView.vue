<template>
  <div class="syllable-wrapper">
    <div class="title-container">{{ title }}</div>
    <div class="syllable-container">
      <div 
        v-if="isStarted" 
        :class="{'center-icon': true, 'syllable-content': true, 'is-paused': isPaused, 'is-disappearing': isDisappearing}" 
        @click="onClickSyllable"
      >{{ syllableStore.text }}</div>
      <div v-show="!isStarted" class="go-content center-icon">
        <Button icon="pi pi-caret-right" severity="success" rounded outlined size="large" @click="onClickStart"/>
      </div>
      <div v-show="isPaused" class="pause-container center-icon">
        <Button icon="pi pi-pause" severity="success" rounded outlined size="large" @click="onClickPause"/>
      </div>
      <BaseFireworksVue v-if="isEnded && isFireworksVisible" :class="{'is-disappearing': isFireworksDisappearing}"/>
      <div v-show="isRestartAvailable" class="restart-container center-icon">
        <Button icon="pi pi-refresh" severity="success" rounded outlined size="large" @click="onClickRestart"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from 'primevue/button';
import { useRoute } from 'vue-router';
import { useSyllableStore } from '@/stores/syllable';
import { useSettingsStore } from '@/stores/settings';
import { useTrainingsStore } from '@/stores/trainings';
import { speak, setText } from '@/lib/voice';
import { recognition } from '@/lib/recognition';
import BaseFireworksVue from '@/components/BaseFireworks.vue';

const route = useRoute();
const syllableStore = useSyllableStore();
const settingsStore = useSettingsStore();
const trainingsStore = useTrainingsStore();
const syllableCount = ref(0);
const isPaused = ref(false);
const isDisappearing = ref(false);
const isFireworksDisappearing = ref(false);
const isFireworksVisible = ref(false);
const isRestartAvailable = ref(false);

const syllMult = (count:number) => {
  if (count === 1) return 'слог';
  if (count < 5) return 'слога';
  return 'слогов';
};

const consonantCount = computed(() => (route.params.consonants ? [Number(route.params.consonants)] : (route.params.vowels === '1' ? [1, 2] : [Number(route.params.vowels)])));
const title = computed(() => `Слова (${route.params.vowels} ${syllMult(Number(route.params.vowels))}, ${consonantCount.value.join('-')} Согласныx)`);
const isStarted = computed(() => syllableCount.value > 0);
const isEnded = computed(() => syllableCount.value === settingsStore.answerCount);

const pause = async (timeout:number) => new Promise((res) => { setTimeout(() => res(true), timeout); });

const oneStep = async () => {
  syllableStore.updateText();
  isDisappearing.value = false;
  syllableCount.value += 1;
  let seconds = 0;
  if (recognition) {
    recognition.start();
    recognition.onresult = (event:SpeechRecognitionResult) => {
      console.log(event);
    };
    recognition.onspeechend = () => {
      console.log('onspeechend');
      // recognition.stop();
    };
    recognition.onnomatch = (event:unknown) => {
      console.log('onnomatch', event);
    };
    recognition.onerror = (event:unknown) => {
      console.log('onerror', event);
    };
  }
  while (seconds * 1000 < settingsStore.answerDelay || isPaused.value) {
    // eslint-disable-next-line no-await-in-loop
    await pause(1000);
    seconds += 1;
  }
  if (recognition) {
    recognition.stop();
  }
  const waiter = pause(1500);
  setText(syllableStore.text);
  speak();
  await waiter;
  isDisappearing.value = true;
  await pause(1000);
};

const startTraining = () => {
  const stepFn = async () => {
    if (isEnded.value) {
      console.log('done');
      trainingsStore.resultItems.push({
        datetime: new Date(),
        type: 'syllable',
        totalItems: syllableCount.value,
        successItems: syllableCount.value,
      });
      isFireworksVisible.value = true;
      await pause(3000);
      isFireworksDisappearing.value = true;
      await pause(1000);
      isFireworksVisible.value = false;
      isFireworksDisappearing.value = false;
      isRestartAvailable.value = true;
      return;
    }
    await oneStep();
    stepFn();
  };
  stepFn();
};

const onClickStart = () => startTraining();

const onClickSyllable = () => {
  if (isEnded.value) return;
  isPaused.value = true;
};

const onClickPause = () => {
  isPaused.value = false;
};

const onClickRestart = () => {
  syllableCount.value = 0;
  isRestartAvailable.value = false;
};
</script>

<style scoped>
.syllable-wrapper {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.syllable-content {
  font-size: 10rem;
  &.is-paused {
    opacity: 0.5;
  }
}
.center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.is-disappearing {
  transition: opacity 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  opacity: 0;
}
.title-container {
  align-self: flex-start;
}
</style>
