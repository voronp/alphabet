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
    </div>
  </div>
</template>

<script setup lang="ts">
import InputSwitch from 'primevue/inputswitch';
import Dropdown from 'primevue/dropdown';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();

</script>

<style scoped>

</style>
