<template>
    <div class="flex flex-col w-full max-w-7xl">
        <UPageHeader :ui="{ container: 'px-4', headline: 'px-4' }" class="flex flex-col w-full" title="Contact Form"
            description="Have questions or want to collaborate? Send me a message, and I'll get back to you soon!"
            headline="If you like what you see lets talk!" />

        <ContactForm />
    </div>
</template>
<script lang="ts" setup>
import ContactForm from '~/components/contact/ContactForm.vue';

const config = useRuntimeConfig()

useHead({
    title: 'Contact',
    meta: [
        { name: 'description', content: 'Get in touch with Barış Önurme for collaborations or inquiries.' },
        { property: 'og:title', content: 'Contact — Barış Önurme' },
        { property: 'og:description', content: 'Get in touch with Barış Önurme for collaborations.' },
        { property: 'og:url', content: `${config.public.siteUrl}/contact` }
    ],
    link: [{ rel: 'canonical', href: `${config.public.siteUrl}/contact` }]
})
</script>
<style></style>