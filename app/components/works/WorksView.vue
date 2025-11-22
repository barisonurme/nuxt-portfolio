<template>
    <div class="flex w-full h-full justify-center items-center z-10 mt-44 border-muted/50 px-4">
        <div
            class="flex w-full max-w-7xl bg-inverted/5 border-x border-t border-x-muted/80 border-t-white/30 rounded-t-3xl xl:rounded-t-4xl  rounded-b-none p-2 xl:p-8 pb-0!  backdrop-blur-3xl [540px]">
            <div
                class="flex flex-col gap-4 w-full max-w-7xl bg-default rounded-2xl  rounded-b-none p-8 backdrop-blur-3xl h-full">
                <div class="flex w-full justify-start items-center">
                    <p class="tracking-wider text-2xl font-black text-primary">WORKS</p>
                </div>
                <div class="grid grid-cols-12 gap-4">
                    <UPageCard v-for="(work, index) in works" :key="index"
                        class="group col-span-12 lg:col-span-6 bg-primary/50" :title="work.title"
                        :description="work.description" :icon="work.icon" orientation="vertical" spotlight
                        spotlight-color="primary" />
                </div>

            </div>
        </div>

    </div>
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