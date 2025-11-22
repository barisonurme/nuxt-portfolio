<script setup lang="ts">

const authors = ref([
    {
        name: 'Baris Onurme',
        description: 'github.com/barisonurme',
        avatar: {
            src: 'data:image/jpeg;base64,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'
        },
        to: 'github.com/barisonurme',
        target: '_blank'
    }
])


const posts = [
    {
        title: "From React to Nuxt: What I Wish I Knew Earlier",
        description: "A React developer's journey switching to Nuxt: mental models, reactivity, SSR and common pitfalls.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "Building a Custom Video Player in React Using HLS.js",
        description: "How to implement a fully custom HLS video player in React with hooks, events, and performance tricks.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "Interactive Maps in React with Leaflet",
        description: "A practical walkthrough creating map UIs, markers, geofences, and optimizing performance with React-Leaflet.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "Scaling Design Systems in React with shadcn/ui + Tailwind",
        description: "How shadcn/ui empowers scalable, consistent UI systems and how to structure them in real projects.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "Applying Atomic Design in React: What Works and What Doesn't",
        description: "A real-world look at using Atomic Design in React, plus folder structures, reuse patterns, and pitfalls.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "SOLID Principles in React: Real Examples, Not Theory",
        description: "Breaking down SOLID with practical React examples small hooks, reusable components, and clean architecture.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "React Performance in 2025: Things I Wish I Knew Earlier",
        description: "Modern performance tuning using Suspense, useDeferredValue, server components, memoization and more.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "Beyond Redux: Choosing State Management in 2025",
        description: "Zustand, Jotai, Recoil, Signals, or server state? A practical guide for scaling React apps.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "Custom React Hooks That Changed How I Build Apps",
        description: "A collection of powerful custom hooks like useDebounce, useAsync, useHLS, useIntersectionObserver and more.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    },
    {
        title: "Lessons From My First 4 Years as a React Developer",
        description: "A personal reflection on growth, mistakes, breakthroughs, and what truly matters in frontend development.",
        date: "2024-11-25",
        img: "https://linda-hoang.com/wp-content/uploads/2014/10/img-placeholder-dark.jpg"
    }
]


</script>

<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="flex flex-col w-full justify-center items-center">


        <div class="blur light:opacity-50 top-0 absolute flex w-full h-[540px] opacity-20" />


        <div class="flex w-full max-w-7xl">
            <UPageHeader :ui="{ container: 'px-4', headline: 'px-4' }" class="flex flex-col w-full" title="Blog Posts"
                description="My knowledge and the lessons I've learned along my development and design journey."
                headline="Lesson Learned" />

        </div>
        <div class="grid grid-cols-12 gap-8 w-full max-w-7xl">



            <div class="grid col-span-8  p-4">

                <div class="flex flex-col gap-4">
                    <h1 class="text-2xl font-black text-primary mt-12 mb-4 z-50"><span class="text-default">All
                        </span>Posts</h1>
                    <UCard v-for="(post, i) in posts" :key="i" class="flex flex-col gap-1 w-full bg-muted/20">

                        <template #header>
                            <div class="flex w-full justify-between items-start">
                                <div class="flex flex-col">
                                    <p class="font-bold">{{ post.title }}</p>
                                    <p class="text-xs opacity-50">21.12.2025</p>
                                </div>
                                <p class="opacity-50 text-xs font-black">5 min read</p>
                            </div>
                        </template>
                        <template #default>
                            <p class="opacity-50">{{ post.description }}</p>

                        </template>
                    </UCard>
                </div>
            </div>

            <div class="grid col-span-4 gap-4 p-4 justify-start items-start">

                <div class="flex flex-col gap-4 h-full justify-start items-start">
                    <h1 class="text-2xl font-black text-primary mt-12 mb-4 z-50">Featured</h1>

                    <UBlogPost v-for="(post, i) in posts.slice(0, 2)" :key="i" class="col-span-4 bg-muted/20"
                        v-bind="post" :authors="authors" description="" />
                </div>
            </div>
        </div>
    </div>
</template>
