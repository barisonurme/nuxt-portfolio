<template>
    <div class="flex flex-col justify-start items-start max-w-6xl w-full mt-44 p-8 lg:p-24">
        <h2 class="text-4xl">Passionate about</h2>
        <div class="flex flex-col md:flex-row gap-4 items-start text-white!">
            <h1 class="text-6xl lg:text-[102px] h-auto md:h-32 mt-2 font-bold text-primary ">
                Building</h1>
            <ContainerTextFlip :interval=5000 :words="words"
                class="h-auto md:h-32 bg-muted/0 text-primary! underline!" />
        </div>
        <h3 class="text-2xl mt-24 lg:mt-4 opacity-70   -translate-y-4">Whether it's crafting structure or
            fine-tuning
            every
            byte.</h3>
        <div class="flex gap-4 mt-12">
            <UButton size="lg" class="">About</UButton>
            <UButton size="lg" variant="outline">Contact</UButton>
        </div>

    </div>
</template>

<script lang="ts" setup>
import ContainerTextFlip from '~/components/ui/container-text-flip/ContainerTextFlip.vue';
const words = ['Experience', 'for Scale', 'that Matter', 'with Style']
</script>

<style scoped>
h1 {
    font-family: "Exo 2", sans-serif;
}
</style>
