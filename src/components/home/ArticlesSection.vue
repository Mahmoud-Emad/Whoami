<template>
  <div class="articles mt-3">
    <h2 class="title mb-4" title="Favourite Articles">🌟 Favourite Articles</h2>
    <LoadingComponent type="article" :content-length="2" :content-name="'Favourite Articles'"
      v-if="apiLoadingStore.isLoading()" />

    <div class="article pa-2" v-else>
      <v-row v-for="(article, index) in articles" :key="index" class="d-flex justify-space-between align-center">
        <v-col cols="8" class="d-flex justify-start align-center">
          <a style="font-family: system-ui !important;" target="_blank" :href="article.link" class="article-link">
            <v-icon color="primary" size="20">
              mdi-note-edit-outline
            </v-icon>
            {{ article.title.length > 60 ? article.title.slice(0, 60) + '...' : article.title }}
          </a>
        </v-col>
        <v-col cols="4" class="d-flex justify-end align-center">
          <p class="text-light-gray">{{ formatData(article.createdAt!) }}</p>
        </v-col>
      </v-row>
      <div class="long-line opacity-80 mt-2" />
    </div>
    <small>
      The pinned articles are saved in your browser's local storage, also it should be at the top of
      the list.
    </small>
  </div>
</template>


<script lang="ts">
import { onMounted, Ref, ref } from 'vue';
import { ArticleType } from '../../types';
import { useAPILoading } from '../../store';
import LoadingComponent from '../LoadingComponent.vue';
import { formatData } from '../../utils';


export default {
  name: 'ArticlesSection',
  components: { LoadingComponent },

  setup() {
    onMounted(async () => {
      await loadArticles();
    });

    const apiLoadingStore = useAPILoading()
    const articles: Ref<ArticleType[]> = ref([]);

    const loadArticles = async () => {
      apiLoadingStore.setLoading(true)
      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL;
        const res = await fetch(`${serverUrl}/articles`);
        const result = await res.json();
        if (res.ok) {
          if (result.total === 0) {
            // TODO: No articles found, Handle it
            return;
          }
          articles.value = result.data;
        } else {
          console.error("Error adding article:", result.error);
        }
      } catch (error) {
        console.error("Error adding article:", error);
      }
      apiLoadingStore.setLoading(false)
    }

    return {
      apiLoadingStore,
      articles,
      formatData,
    };
  },
};
</script>
