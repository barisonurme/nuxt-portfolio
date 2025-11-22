<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import FooterView from './components/ui/footer/FooterView.vue';

const HEADER_HEIGHT = '80px'

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'About',
    to: '/about',
  },
  {
    label: 'Works',
    to: '/works',
  },
  {
    label: 'Contact',
    to: '/contact',
  },
  {
    label: 'Blog',
    to: '/blog',
  }
])
</script>

<template>
  <!-- eslint-disable vue/first-attribute-linebreak -->
  <UHeader :style="{ height: HEADER_HEIGHT }">
    <template #title>
      <p class="text-primary font-black text-font-custom">baris<span class="text-white">.</span></p>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UButton color="neutral" variant="ghost" to="https://github.com/nuxt/ui" target="_blank"
        icon="i-simple-icons-github" aria-label="GitHub" />
    </template>
  </UHeader>

  <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'center' }">
    <NuxtPage />
  </div>

  <FooterView />

</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
