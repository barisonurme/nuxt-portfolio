<script setup lang="ts">

import { PortableText } from '@portabletext/vue'
import { useDateFormat } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useSanityClient } from '~/plugins/utils/sanaty'

import "./blog.css"

const client = useSanityClient()
const route = useRoute()
const slug = route.params.slug

const { data: post } = await useAsyncData(`post-${slug}`, async () => {
    try {
        const query = `*[_type == "post" && slug.current == $slug][0]{
      title,
      description,
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
        return await client.fetch(query, { slug })
    } catch (err) {
        console.error('Sanity fetch error:', err)
        return null
    }
})


</script>

<template>
    <div class="flex flex-col w-full max-w-7xl justify-center mb-24">
        <div class="hidden blur light:opacity-50 top-0 absolute xl:flex w-full h-[540px]  -z-10 -translate-y-1/2" />
        <div class="absolute xl:hidden h-dvh w-full top-0 bg-linear-to-b from-primary/10 via-primary/0 to-primary/0" />

        <div class="flex flex-col w-full p-8">
            <img :src="post.mainImage.asset.url" :alt="post.mainImage.alt" />

            <h1 class="text-4xl my-4 text-primary font-black">{{ post.title }}</h1>
            <h1 class="text-xl my-4">{{ useDateFormat(post.publishedAt,
                'YYYY-MM-DD') }}</h1>

            <USeparator type="dashed" class="my-4 mb-12" />
            <p>{{ post.description }}</p>

            <!-- Portable Text rendering -->
            <div class="portable-text">
                <PortableText v-if="post.body" :value="post.body" />
            </div>

        </div>

        <div class="flex w-full justify-center items-center">
            <UButton variant="ghost" to="/blog" class="px-12">
                <UIcon name="i-lucide:arrow-left" />
                Back to Blogs
            </UButton>
        </div>
    </div>
</template>

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
