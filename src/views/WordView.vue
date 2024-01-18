<template>
  <div class="word-wrapper">
    <div class="title-container">{{ title }}</div>
    <div class="word-container">
      <div 
        v-if="isStarted" 
        :class="{'center-icon': true, 'word-content': true, 'is-paused': isPaused, 'is-disappearing': isDisappearing, 'is-matched': isMatched}" 
        @click="onClickWord"
      >{{ wordStore.text }}</div>
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
import { computed, ref, watch } from 'vue';
import Button from 'primevue/button';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import { useWordStore } from '@/stores/word';
import { useSettingsStore } from '@/stores/settings';
import { useTrainingsStore } from '@/stores/trainings';
import { speak, setText } from '@/lib/voice';
import { recognition } from '@/lib/recognition';
import { useRecognition } from '@/hooks/useRecognition';
import BaseFireworksVue from '@/components/BaseFireworks.vue';

const route = useRoute();
const wordStore = useWordStore();
const settingsStore = useSettingsStore();
const trainingsStore = useTrainingsStore();
const wordCount = ref(0);
const isPaused = ref(false);
const isDisappearing = ref(false);
const isFireworksDisappearing = ref(false);
const isFireworksVisible = ref(false);
const isRestartAvailable = ref(false);
const { isMatched, tryRecognize, setTarget } = useRecognition();

const syllMult = (count:number) => {
  if (count === 1) return 'слог';
  if (count < 5) return 'слога';
  return 'слогов';
};

const consonantCount = computed(() => (route.params.consonants ? [Number(route.params.consonants)] : (route.params.vowels === '1' ? [1, 2] : [Number(route.params.vowels)])));
const title = computed(() => `Слова (${route.params.vowels} ${syllMult(Number(route.params.vowels))}, ${consonantCount.value.join('-')} Согласныx)`);
const isStarted = computed(() => wordCount.value > 0);
const isEnded = computed(() => wordCount.value === settingsStore.answerCount);
const isInterrupted = ref(false);

const pause = async (timeout:number) => new Promise((res) => { setTimeout(() => res(true), timeout); });

const oneStep = async () => {
  if (isInterrupted.value) {
    return;
  }
  wordStore.updateText();
  setTarget(wordStore.text);
  isDisappearing.value = false;
  wordCount.value += 1;
  let seconds = 0;
  if (recognition) {
    recognition.start();
    recognition.onresult = (event:SpeechRecognitionEvent) => {
      const isMatch = tryRecognize(event);
      console.log(isMatch);
    };
    recognition.onspeechend = () => {
      console.log('onspeechend');
    };
    recognition.onnomatch = (event:unknown) => {
      console.log('onnomatch', event);
    };
    recognition.onerror = (event:unknown) => {
      console.log('onerror', event);
    };
  }
  while (seconds * 1000 < settingsStore.answerDelay || isPaused.value) {
    if (isMatched.value) break;
    // eslint-disable-next-line no-await-in-loop
    await pause(1000);
    seconds += 1;
  }
  if (isInterrupted.value) {
    return;
  }
  
  if (recognition) {
    console.log('recognition.stop');
    recognition.stop();
  }
  const waiter = pause(1500);
  setText(wordStore.text);
  speak();
  await waiter;
  if (isInterrupted.value) {
    return;
  }
  isDisappearing.value = true;
  await pause(settingsStore.pauseDelay);
};

const startTraining = () => {
  console.log(wordStore.matchingWords);
  wordStore.resetUnique();
  const stepFn = async () => {
    if (isInterrupted.value) {
      return;
    }
    if (isEnded.value) {
      console.log('done');
      trainingsStore.resultItems.push({
        datetime: new Date(),
        type: 'word',
        totalItems: wordCount.value,
        successItems: wordCount.value,
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

const onClickWord = () => {
  if (isEnded.value) return;
  isPaused.value = true;
};

const onClickPause = () => {
  isPaused.value = false;
};

const onClickRestart = () => {
  isInterrupted.value = false;
  wordCount.value = 0;
  isRestartAvailable.value = false;
};

const interrupt = () => {
  isInterrupted.value = true;
  if (recognition) {
    recognition.stop();
  }
  isRestartAvailable.value = true;
  wordCount.value = 0;
};

onBeforeRouteLeave(() => {
  console.log('leave');
  interrupt();
});

watch([
  () => route.params.vowels,
  consonantCount,
], ([v, c]) => {
  wordStore.setParams(Number(v), c);
}, { immediate: true });

</script>

<style scoped>
.word-wrapper {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.word-content {
  font-size: 10rem;
  &.is-paused {
    opacity: 0.5;
  }
  &.is-matched {
    color: forestgreen;
    transition: color 0.5s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 1s cubic-bezier(0.075, 0.82, 0.165, 1);
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
