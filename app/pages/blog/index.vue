<script setup lang="ts">
import { useAsyncData } from '#app'
import { useSanityClient } from '~/plugins/utils/sanaty'

const client = useSanityClient()

const authors = ref([
    {
        name: 'Baris Onurme',
        description: 'github.com/barisonurme',
        avatar: {
            src: 'data:image/jpeg;base64,...' // truncated
        },
        to: 'github.com/barisonurme',
        target: '_blank'
    }
])

const { data: posts } = await useAsyncData('posts', async () => {
    const query = `*[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    slug,
    body,
    publishedAt
  }`
    return await client.fetch(query)
})
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
                    <div v-for="(post, i) in posts" :key="i">
                        <NuxtLink :to="`/blog/${post.slug.current}`">
                            <UCard class="flex flex-col gap-1 w-full bg-muted/20">
                                <div class="flex w-full justify-between items-start">
                                    <div class="flex flex-col">
                                        <p class="font-bold">{{ post.title }}</p>
                                        <!-- <p class="text-xs opacity-50">{{ formatDate(post.publishedAt, "hh-mm-yyyy") }}</p> -->
                                    </div>
                                    <p class="opacity-50 text-xs font-black">5 min read</p>
                                </div>
                                <p class="opacity-50">{{ post.description }}</p>
                            </UCard>
                        </NuxtLink>
                    </div>
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
