<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <UPageCard v-for="(work, index) in works" :key="index" class="group col-span-12 lg:col-span-6 bg-primary/50"
        :title="work.title" :description="work.description" :icon="work.icon" orientation="vertical" spotlight
        spotlight-color="primary">
        <!--       <img :src="work.src" :alt="work.alt"
            class='saturate-0 group-hover:saturate-100 opacity-10 group-hover:opacity-90 duration-500 transition-all'> -->
    </UPageCard>


</template>
<script lang="ts" setup>


const works = [
    {
        title: 'Order&Track',
        description: 'Pizzaria designed to only for Pizza restaurans to take order from customers and track it from admin panel.',
        icon: 'i-lucide-lightbulb',
        src: 'https://barisonurme.web.app/projects/pizzaria.jpg',
        alt: "Order Track",
    },
    {
        title: 'TrainMate',
        description: `TrainMate is web application for users who want's to track their proggress when working out.`,
        icon: 'i-lucide-lightbulb',
        src: 'https://barisonurme.web.app/projects/trainmate.gif',
        alt: "TrainMate",
    },
    {
        title: 'Chappter',
        description: 'Chappter real-time chat applications developed with React Native.',
        icon: 'i-lucide-lightbulb',
        src: 'https://barisonurme.web.app/projects/chappter.gif',
        alt: "Chappter",
    },
    {
        title: 'OrderFood',
        description: 'Order Food Project helps restaurants easily add and update food prices. It also lets them create customized websites and menu designs to showcase their offerings..',
        icon: 'i-lucide-lightbulb',
        src: 'https://barisonurme.web.app/projects/orderFood.jpg',
        alt: "Order Food",
    },

]

</script>
<style></style>