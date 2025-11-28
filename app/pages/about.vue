<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="flex flex-col w-full max-w-7xl h-full">
        <UPageHeader :ui="{ container: 'px-4', headline: 'px-4' }" class="flex flex-col w-full" title="About Me"
            description="Have questions or want to collaborate? Send me a message, and I'll get back to you soon!"
            headline="Information" />

        <AboutView :page-mode="true" />

        <NuxtLink class="pl-8 pb-4 my-12" to="/contact">
            <p class="group  font-semibold hover:underline cursor-pointer items-center flex">
                Contact
                <UIcon name="i-lucide-chevron-right" class="size-5 group-hover:translate-x-1/2 duration-500" />
            </p>
        </NuxtLink>
    </div>
</template>
<script lang="ts" setup>
import AboutView from '~/components/about/AboutView.vue';




</script>
<style></style>