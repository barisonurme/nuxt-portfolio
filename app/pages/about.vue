<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="flex flex-col w-full max-w-7xl h-full">
        <UPageHeader :ui="{ container: 'px-4', headline: 'px-4' }" class="flex flex-col w-full" title="About Me"
            description="Have questions or want to collaborate? Send me a message, and I'll get back to you soon!"
            headline="About me" />

        <AboutView :page-mode="true" />
    </div>
</template>
<script lang="ts" setup>
import AboutView from '~/components/about/AboutView.vue';




</script>
<style></style>