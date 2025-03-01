<template>
  <div class="contact pa-3 ml-4">
    <div class="section">
      <h1 class="mb-4">Guestbook</h1>
      <v-card class="pa-5 head-card mb-4" :style="{ background: 'transparent !important' }">
        <v-row>
          <v-col cols="2" class="pb-0">
            <v-img src="/src/assets/images/guestbook.gif" width="550" height="150"></v-img>
          </v-col>
          <v-col cols="10" class="d-flex align-center pb-0">
            Hi! In the 90s and early 2000s, having a guestbook on one’s website was a common practice,
            a space where people shared their thoughts and opinions. Feel free to drop a few lines or just
            say hi. Hope you enjoy navigating my little corner of the web!
          </v-col>
          <v-col class="d-flex justify-center pt-0">
            <v-btn @click="scrollToGuestbook" color="info">Sign Guestbook</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- Guestbooks Intro -->
      <div class="mb-4">
        <small>
          Here are some heartfelt messages from the wonderful visitors of this site. Each message has the
          power to brighten my day and lift my spirits. Feel free to share your thoughts – your words truly
          matter and
          make a difference!
        </small>
      </div>
    </div>

    <!-- Guestbook Messages -->
    <div class="section scrollable-div mb-4" :style="{ height: guestbooks.length < 3 ? 'auto' : '550px' }">
      <LoadingComponent type="card" :content-length="4" :content-name="'Guestbooks'"
        v-if="apiLoadingStore.isLoading()" />
      <v-row v-else class="mb-4 pa-0 ma-0">
        <v-col cols="12" xl='6' md="6" sm="6" xs="12" v-for="guestbook in guestbooks" :key="guestbook.name">
          <v-card class="pa-5 head-card pb-0 mb-0"
            :style="{ background: 'transparent !important', height: '150px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }">
            <v-row>
              <v-col cols="2">
                <img src="/src/assets/images/guest.png" width="65" height="40" />
              </v-col>
              <v-col cols="10">
                <p class="d-flex align-center ml-1" style="width: 100%;">
                  <a :title="'click to visit' + ' ' + guestbook.website" v-if="guestbook.website"
                    :href="normalizeUrl(guestbook.website!)" target="_blank" class="guestbook-link">
                    {{ guestbook.name }}
                    <v-badge title="website added." class="ml-1 mb-2" dot color="primary"></v-badge>
                  </a>
                <p v-else class="guestbook-link" style="text-decoration: none;">
                  {{ guestbook.name }}
                </p>
                </p>
                <small class="date-style ml-1">{{ formatData(guestbook.createdAt || '') }}</small>
              </v-col>
            </v-row>
            <!-- Message -->
            <p class="pa-3">
              {{
                guestbook.message.length > 60 ? guestbook.message.slice(0, 60) + '...' :
                  guestbook.message
              }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Contact Form -->
    <div class="section" id="guestbookForm">
      <v-card class="form-card pa-4 pb-0 mb-4" :style="{ background: 'transparent !important' }">
        <v-form v-model="validForm" class="pb-0 mb-0">
          <v-text-field v-model="newGuestbook.name" :counter="25" :rules="nameRules({
            fieldName: 'Your Name',
            maxLength: 25,
            minLength: 5
          })" label="Your Name*" hint="Your name, Your handle, Your full name" hide-details="auto" />
          <v-text-field :counter="100" v-model="newGuestbook.website"
            :rules="newGuestbook.website?.length ? websiteRules() : []" label="Your Website/Github"
            hint="Optional field, but if entered, it will be validated and linked in the guestbook."
            hide-details="auto" />
          <v-textarea v-model="newGuestbook.message" :counter="500" :rules="longTextRules({
            fieldName: 'Your Message',
            maxLength: 500,
            minLength: 30
          })" label="Your Message*" hide-details="auto" />
          <v-alert class="card-header" color="form">
            <p>Anti-bot validation 🙃</p>
            <small>
              Unfortunately, spam is becoming increasingly harder to prevent. If you're human, please type
              down my most commonly seen <strong>@handle</strong> or <strong>@fullname</strong>, which is
              also part of the domain name of this website.
            </small>
          </v-alert>
          <v-text-field :rules="antiBotRules()" class="mt-4" label="ha?..*"></v-text-field>
          <div class="d-flex justify-end mb-4">
            <v-btn color="info" :disabled="!validForm" @click="writeGuestbook(newGuestbook)">Sign
              Guestbook</v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { nameRules, antiBotRules, websiteRules, longTextRules } from '../utils';
import { type GuestBookType } from '../types';
import LoadingComponent from '../components/LoadingComponent.vue';
import { useAPILoading } from '../store';
import { formatData } from '../utils';

export default {
  name: 'Guestbook',
  components: { LoadingComponent, },
  setup() {
    const validForm = ref(false);
    const newGuestbook = ref({} as GuestBookType);
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const guestbooks = ref<GuestBookType[]>([]);
    const apiLoadingStore = useAPILoading()

    onMounted(() => {
      loadGuestbooks();
    })

    // Load guestbooks from backend with sorting and pagination
    const loadGuestbooks = async () => {
      try {
        apiLoadingStore.setLoading(true);
        const res = await fetch(`${serverUrl}/guestbooks`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        guestbooks.value = result.data;
      } catch (error) {
        console.error("Failed to load guestbooks:", error);
      } finally {
        apiLoadingStore.setLoading(false);
      }
    };

    // Write a new guestbook entry to backend
    const writeGuestbook = async (guestbook: GuestBookType) => {
      try {
        apiLoadingStore.setLoading(true);
        const res = await fetch(`${serverUrl}/guestbooks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(guestbook),
        });

        const result = await res.json();

        if (res.ok) {
          guestbooks.value.unshift(result.data);
        } else {
          console.error("Error adding guestbook:", result.error);
        }
      } catch (error) {
        console.error("Failed to write guestbook:", error);
      } finally {
        apiLoadingStore.setLoading(false);
      }
    };

    // Scroll to the guestbook section
    const scrollToGuestbook = () => {
      const guestbookForm = document.getElementById("guestbookForm");
      if (guestbookForm) {
        guestbookForm.scrollIntoView({ behavior: "smooth" });
      }
    };

    const normalizeUrl = (url: string) => {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
      }
      return `https://${url}`;
    }

    return {
      guestbooks,
      validForm,
      newGuestbook,
      apiLoadingStore,
      formatData,
      normalizeUrl,
      longTextRules,
      websiteRules,
      antiBotRules,
      scrollToGuestbook,
      nameRules,
      writeGuestbook,
    };
  }
};
</script>

<style scoped>
.scrollable-div {
  /* height: 350px; */
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(2, 35, 43, 0.5) rgba(0, 0, 0, 0);
}

.scrollable-div::-webkit-scrollbar {
  width: 8px;
}

.scrollable-div::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

.scrollable-div::-webkit-scrollbar-track {
  background-color: transparent;
}

.guestbook-link {
  color: #0077b6;
  text-decoration: none;
}

.guestbook-link:hover {
  text-decoration: underline;
}
</style>