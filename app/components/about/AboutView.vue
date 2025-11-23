<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div v-show="pageMode">
        <div
            class="hidden blur opacity-20 light:opacity-10 top-0 absolute xl:flex w-full h-[540px]  -z-10 -translate-y-1/2" />
        <div class="absolute xl:hidden h-dvh w-full top-0 bg-linear-to-b from-primary/10 via-primary/0 to-primary/0" />
    </div>
    <div class="flex w-full min-h-[540px] max-w-7xl h-full border-x border-muted/50"
        :class="pageMode ? 'border-none!' : ''">
        <div class="grid grid-cols-12 w-full h-full">
            <div v-show="!pageMode" class="col-span-12 xl:col-span-4 h-full border-r border-muted/50">
                <div class="flex justify-center items-center w-full md:h-auto xl:h-1/2"
                    :class="pageMode ? '' : 'border-b border-muted/50'">
                    <p class="mt-12 xl:mt-0 text-6xl text-primary font-semibold">About <span
                            class="text-default">Me</span></p>
                </div>
                <div class="hidden xl:flex justify-center items-center w-full h-1/2">
                    <NuxtLink to="/contact">
                        <p class="group text-2xl font-semibold hover:underline cursor-pointer items-center flex">Contact
                            <UIcon name="i-lucide-chevron-right"
                                class="text-primary size-5 group-hover:translate-x-1/2 duration-500" />
                        </p>
                    </NuxtLink>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-8 w-full">
                <div class="flex w-full flex-col gap-12 p-8 text-lg py-12 pb-24 xl:py-44"
                    :class="pageMode ? 'py-8! text-2xl!' : ''">
                    <div class="flex flex-col w-full">
                        <p class="font-black text-primary">Background</p>
                        I started my career in 2015 as a Graphic Designer, shaping visual identities and creating both
                        digital and
                        print
                        assets across a range of mediums. I also spent a year studying graphic design in Czechia and
                        later worked
                        for
                        nearly five years at a major e-commerce company, where I was responsible for UI banners, print
                        materials,
                        and
                        motion graphics.
                    </div>
                    <div class="flex flex-col w-full">

                        <p class="font-black text-primary">Front-End Development</p>
                        In 2022, I transitioned into Front-End Development to merge my design roots with a growing
                        passion for
                        building
                        clean, engaging user interfaces. Now based in Ankara, I focus on creating responsive,
                        accessible, and
                        visually
                        refined web applications.
                    </div>


                    <div class="flex flex-col w-full">
                        <p class="font-black text-primary">Current Focus & Goals</p>
                        With a strong foundation in visual design and a solid grasp of modern frontend tools like React,
                        Next.js,
                        and
                        Tailwind CSS, I aim to bridge the gap between aesthetics and functionality—crafting user
                        experiences that
                        are
                        not only beautiful but also intuitive, performant, and scalable.
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">

const { pageMode } = defineProps({ pageMode: Boolean })
</script>

<style></style>