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
</script>
