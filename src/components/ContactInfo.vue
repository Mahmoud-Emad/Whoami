<template>
    <div class="section mb-4">
        <h1 v-if="title">{{ title }}</h1>
        <p v-if="description" class="mt-3" v-html="description + (additionalText || '')"></p>
        <v-row v-if="cols">
            <v-col cols="6">
                <v-card class="pa-2 mt-4" outlined color="transparent"
                    :style="{ border: '1px solid rgb(var(--v-theme-border-color))', borderRadius: '6px', fontSize: '12px' }">
                    <a :href="link" target="_blank">{{ linkText }}</a>
                </v-card>
            </v-col>
        </v-row>
        <v-card v-else class="pa-2 mt-4" outlined color="transparent"
            :style="{ border: '1px solid rgb(var(--v-theme-border-color))', borderRadius: '6px', fontSize: '12px' }">
            <a :href="link" target="_blank">{{ linkText }}</a>
        </v-card>
    </div>
</template>

<script lang="ts">

export default {
    name: 'ContactInfo',
    props: {
        title: String,
        description: String,
        additionalText: String,
        link: String,
        linkText: String,
        cols: Boolean,
    },
}
</script>

<style scoped>
.section {
    margin-bottom: 24px;
}

.text-info {
    font-weight: bold;
    color: #00c0ef;
}
</style>