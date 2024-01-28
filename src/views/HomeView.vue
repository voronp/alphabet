<template>
  <main class="main-area">
    <div class="greeting">
      <div v-if="profileStore.userName" class="existing-name">
        Привет {{ profileStore.userName }}!
        <Button icon="pi pi-times" rounded text size="large" severity="secondary" @click="onResetName"/>
        <Button icon="pi pi-comment" rounded text size="large" severity="secondary" @click="sayHello(profileStore.userName)"/>
      </div>
      <div v-else class="new-name">
        Привет, как тебя зовут? напиши
        <InputGroup>
          <InputText v-model="name" type="text" @focus="sayHello(profileStore.userName)"/>
          <Button icon="pi pi-check" severity="success" @click="onSaveName"/>
        </InputGroup>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Button from 'primevue/button';
import { ref, watch } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useSettingsStore } from '@/stores/settings';
import { speak, setText } from '@/lib/voice';

const profileStore = useProfileStore();
const settingsStore = useSettingsStore();
const name = ref('');

const onSaveName = () => {
  if (!name.value) return;
  profileStore.userName = name.value;
};

const onResetName = () => {
  profileStore.userName = '';
};

const sayHello = (userName:string) => {
  if (userName) {
    setText(`привет ${userName}`);
    speak();
  } else {
    setText('привет, как тебя зовут? напиши');
    speak();
  }
};

watch([
  () => settingsStore.voice, 
  () => settingsStore.isVoiceEnabled,
  () => profileStore.userName,
], ([voice, isEnabled, userName]) => {
  if (voice && isEnabled) {
    // say hello
    sayHello(userName);
  }
}, { immediate: true });

</script>
<style scoped>
.main-area {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .greeting {
    font-size: 24px;

  }
  .existing-name {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .new-name {
    display: block;
  }
}
</style>
