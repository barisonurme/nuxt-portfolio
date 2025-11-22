<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <img class="absolute object-contain z-10 h-[720px] top-0 w-2/6 translate-y-1/2"
        src="https://github.githubassets.com/assets/particles-de1dd20f3008.png" alt="temp-partical">
    <div class="blur light:opacity-50 top-0 absolute flex w-full h-[540px] translate-y-12" />

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




<style>
.blur {
    width: 693px;
    max-width: 693px;
    height: 765.714px;
    top: 200px;
    left: 50%;
    transform: translate(-50%, 0) rotate(-45deg);
    background: radial-gradient(105.37% 105.37% at -0.01% 100.04%,
            var(--ui-primary) 40.75%,
            rgba(10, 3, 202, 0.359) 80%,
            rgba(255, 255, 255, 0) 100%);
    filter: blur(142px);
}
</style>