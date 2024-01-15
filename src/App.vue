<template>
  <header>
    <Toolbar>
      <template #start>
        <Button icon="pi pi-bars" severity="secondary" text rounded size="large" @click="onClickMenu" />
      </template>

      <template #center>

      </template>

      <template #end>
        <Button icon="pi pi-cog" severity="secondary" text rounded size="large" @click="onClickSettings" />
      </template>
    </Toolbar>
  </header>
  <Sidebar v-model:visible="isMenuOpened" header="Уроки" position="left">
    <div class="left-menu-item">
      <RouterLink to="/syllable">Слоги</RouterLink>
    </div>
    <div class="left-menu-item">
      <RouterLink to="/word/1">Слова (1 слог)</RouterLink>
    </div>
    <div class="left-menu-item">
      <RouterLink to="/word/1/3">Слова (1 слог, 3 согласных)</RouterLink>
    </div>
    <div class="left-menu-item">
      <RouterLink to="/word/2">Слова (2 слога)</RouterLink>
    </div>
  </Sidebar>
  <Sidebar v-model:visible="settingsStore.isSettingsOpened" header="Настройки" position="right">

  </Sidebar>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Sidebar from 'primevue/sidebar';
import { ref } from 'vue';
import { useSettingsStore } from './stores/settings';

const isMenuOpened = ref(false);
const settingsStore = useSettingsStore();

const onClickSettings = () => {
  settingsStore.isSettingsOpened = !settingsStore.isSettingsOpened;
};
const onClickMenu = () => {
  isMenuOpened.value = true;
};
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

</style>
