<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="flex flex-col w-full max-w-7xl">
        <UPageHeader :ui="{ container: 'px-4', headline: 'px-4' }" class="flex flex-col w-full" title="Showcase"
            description="Have questions or want to collaborate? Send me a message, and I'll get back to you soon!"
            headline="Some of my works" />

        <div class="flex w-full h-full justify-center items-center p-4">
            <UAlert title="Under Construction!" description="Work Page Under Construction."
                icon="ix:maintenance-triangle" :ui="{
                    icon: 'size-11'
                }" />
        </div>
    </div>
</template>
<script lang="ts" setup>
const config = useRuntimeConfig()

useHead({
    title: 'Works',
    meta: [
        { name: 'description', content: "Some of Barış Önurme's projects and case studies." },
        { property: 'og:title', content: 'Works — Barış Önurme' },
        { property: 'og:description', content: "Some of Barış Önurme's projects and case studies." },
        { property: 'og:url', content: `${config.public.siteUrl}/works` }
    ],
    link: [{ rel: 'canonical', href: `${config.public.siteUrl}/works` }]
})

</script>
<style></style>