<template>
    <div class="relative flex flex-col justify-center items-center w-full h-full">
        <HeaderView />

        <WorksView />

        <USeparator />

        <TechStack />

        <USeparator />

        <AboutView />
    </div>

</template>

<script lang="ts" setup>
import AboutView from '~/components/about/AboutView.vue';
import HeaderView from '~/components/header/HeaderView.vue';
import TechStack from '~/components/tech-stack/TechStack.vue';
import WorksView from '~/components/works/WorksView.vue';

const config = useRuntimeConfig()

useHead({
    title: 'Home',
    meta: [
        { name: 'description', content: 'Portfolio of Barış Önurme — developer, designer and engineer. See projects, contact and blog.' },
        { property: 'og:title', content: 'Barış Önurme — Portfolio' },
        { property: 'og:description', content: 'Portfolio of Barış Önurme — developer & designer.' },
        { property: 'og:url', content: `${config.public.siteUrl}/` },
        { name: 'twitter:card', content: 'summary_large_image' }
    ],
    link: [
        { rel: 'canonical', href: `${config.public.siteUrl}/` }
    ]
})
</script>
