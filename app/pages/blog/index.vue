<script setup lang="ts">
import { useAsyncData } from '#app'
import { useSanityClient } from '~/plugins/utils/sanaty'
import { useDateFormat } from '@vueuse/core'

const client = useSanityClient()

const authors = ref([
    {
        name: 'Baris Onurme',
        description: 'github.com/barisonurme',
        avatar: {
            src: 'https://media.licdn.com/dms/image/v2/D4D03AQHHwMHSsvDAaw/profile-displayphoto-crop_800_800/B4DZqyLCh1GQAI-/0/1763925830886?e=1765411200&v=beta&t=DtsqH6idD-OuPlo1RpuGIGFpq0F_AG7JhJtzwufd5N8',
            alt: 'author avatar',
        },
        to: 'https://github.com/barisonurme',
        target: '_blank'
    }
])

const { data: posts } = await useAsyncData('posts', async () => {
    const query = `*[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    slug,
    body,
    publishedAt,
    mainImage{
        asset->{
          _id,
          url
        },
        alt
      }
  }`
    return await client.fetch(query)
})

const { data: featured } = await useAsyncData('featured-posts', async () => {
    const query = `*[
    _type == "post" &&
    "Featured" in categories[]->title
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    body,
    publishedAt,
    mainImage{
      asset->{
        _id,
        url
      },
      alt
    }
  }`

    return await client.fetch(query)
})




</script>

<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="flex flex-col w-full justify-center items-center mb-44">


        <div class="hidden blur light:opacity-10 top-0 absolute xl:flex w-full h-[540px] translate-y-12  opacity-20" />
        <div class="absolute xl:hidden h-dvh w-full top-0 bg-linear-to-b from-primary/10 via-primary/0 to-primary/0" />

        <div class="flex w-full max-w-7xl">
            <UPageHeader :ui="{ container: 'px-4', headline: 'px-4' }" class="flex flex-col w-full" title="Blog Posts"
                description="My knowledge and the lessons I've learned along my development and design journey."
                headline="Lesson Learned" />

        </div>
        <div class="grid grid-cols-12 gap-8 w-full max-w-7xl">




            <div class="grid col-span-12 xl:col-span-8  p-4">

                <div class="flex flex-col gap-4">
                    <h1 class="text-2xl font-black text-primary mt-12 mb-4">Latest</h1>
                    <div v-for="(post, i) in posts" :key="i">
                        <NuxtLink :to="`/blog/${post.slug.current}`">
                            <UBlogPost :image="post.mainImage.asset.url" :alt="post.mainImage.alt"
                                class="col-span-4 bg-muted/20" v-bind="post" :authors="authors" description=""
                                :ui="{ image: 'object-contain' }" />
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div class="hidden xl:grid col-span-4 gap-4 p-4 justify-start items-start">

                <div class="flex flex-col gap-4 h-full justify-start items-start">
                    <h1 class="font-black text-primary mt-12 mb-4">Featured</h1>

                    <div v-for="(feature, i) in featured.slice(0, 2)" :key="i" v-bind="feature" class="w-full">
                        <NuxtLink :to="`/blog/${feature.slug.current}`">
                            <UBlogPost class="col-span-4 bg-muted/20 w-full" :title="feature.title"
                                :description="useDateFormat(feature.publishedAt, 'YYYY-MM-DD')" />
                        </NuxtLink>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
