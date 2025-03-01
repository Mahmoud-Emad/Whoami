<template>
  <!-- TODO: The Navbar should be fixed -->
  <!-- <div style="position: fixed; background: red;">
    sss
  </div> -->
  <div class="c-header">
    <v-row class="d-flex justify-space-between align-center">
      <!-- Logo Section -->
      <v-col cols="2" class="pa-0 d-flex justify-center">
        <router-link to="/" class="logo-link">
          <v-img width="100" height="80" src="/src/assets/navbar/logo.png" class="mb-1" alt="Logo"
            title="Want to see my photo? zoom in :P 👀"></v-img>
        </router-link>
      </v-col>

      <!-- Title and Username Section -->
      <v-col cols="4" class="pa-0 d-flex justify-start align-center" style="margin-left: -40px;">
        <strong>
          <h3 title="Omdanii" class="username-title">Mahmoud Emad 🎄</h3>
          <small class="username-description">
            known as <a href="https://github.com/Mahmoud-Emad" target="_blank" title="Mahmoud Emad">@Omdanii</a>
          </small>
        </strong>
      </v-col>

      <!-- Search Section -->
      <v-col cols="6" class="d-flex justify-end align-center">
        <div class="search-container d-flex align-center">
          <input type="text" placeholder="Search..." class="c-search" title="What goes around comes around 🧞‍♀️">
          <div class="c-nav-search-btn">
            <v-img src="/src/assets/icons/search.svg" width="15" height="15" title="Think and dig 🎲"></v-img>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
  <v-card class="c-nav-card-items">

    <router-link @click="activeLink = '/'" :to="'/'" class="nav-link-item" title="About me">❄️ About </router-link>
    <router-link @click="activeLink = '/contact'" :to="'/contact'" class="nav-link-item" title="Contact me">
      📞 Contact
    </router-link>
    <router-link @click="activeLink = '/projects'" :to="'/projects'" class="nav-link-item" title="My projects">
      🎨 Projects
    </router-link>
    <router-link @click="activeLink = '/blog'" :to="'/blog'" class="nav-link-item" title="Photos taken by me">
      ✍️ blog
    </router-link>
    <router-link @click="activeLink = '/guestbook'" :to="'/guestbook'" class="nav-link-item" title="Guestbook">
      🧁 Guestbook
    </router-link>
    <router-link v-if="adminDashboard" @click="activeLink = '/admin-dashboard'" :to="'/admin-dashboard'"
      class="nav-link-item" title="Dashboard">
      📊 Dashboard
    </router-link>
    <router-link @click="activeLink = '/more'" :to="'/more'" class="nav-link-item" title="Wanna more? Click More.">
      🌏 More
    </router-link>
    <template #loader>
      <v-progress-linear v-if="apiLoadingStore.isLoading()" style="margin-top: 34px;" color="primary"
        indeterminate></v-progress-linear>
    </template>
  </v-card>
</template>

<script lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAPILoading, useSettingsStore } from '../store';

export default {
  name: 'Navbar',
  setup() {
    const activeLink = ref('/');
    const adminDashboard = ref(false);
    const apiLoadingStore = useAPILoading()

    onMounted(async () => {
      activeLink.value = window.location.pathname.length > 0 ? window.location.pathname : '/';
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      const settingsStore = useSettingsStore();

      if (serverUrl) {
        const url = new URL(serverUrl);
        settingsStore.server.host = url.hostname;
        settingsStore.server.port = Number(url.port) || (url.protocol === 'https:' ? 443 : 80);
      } else {
        throw new Error('VITE_SERVER_URL is not defined');
      }

      await settingsStore.loadSettings();

      adminDashboard.value = settingsStore.getSettings().configuration.adminDashboard;
    });

    watch(activeLink, () => {
      setTimeout(() => {
        const navLinks = document.querySelectorAll('.nav-link-item');
        navLinks.forEach(link => {
          const linkTo = link.getAttribute('href');
          if (linkTo === activeLink.value) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }, 50)
    }, { deep: true });

    return {
      activeLink,
      adminDashboard,
      apiLoadingStore,
    }
  }
}
</script>


<style scoped>
.active {
  color: rgb(var(--v-theme-link-hover-color)) !important;
}

.nav-link-item:hover {
  color: rgb(var(--v-theme-text-color)) !important;
}
</style>