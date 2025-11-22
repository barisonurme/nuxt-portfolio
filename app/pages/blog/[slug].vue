<script setup lang="ts">

import { PortableText } from '@portabletext/vue'
import { useDateFormat } from '@vueuse/core'

import { useRoute } from 'vue-router'
import { useSanityClient } from '~/plugins/utils/sanaty'
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
        <div class="blur light:opacity-50 top-0 absolute flex w-full h-[540px] -z-10 opacity-10" />

        <div class="flex flex-col w-full p-8">
            <img :src="post.mainImage.asset.url" :alt="post.mainImage.alt" />

            <h1 class="text-4xl my-4 text-primary font-black">{{ post.title }}</h1>
            <h1 class="text-xl my-4">{{ useDateFormat(post.publishedAt,
                'YYYY-MM-DD HH:mm:ss') }}</h1>

            <USeparator type="dashed" class="my-4 mb-12" />
            <p>{{ post.description }}</p>

            <!-- Portable Text rendering -->
            <PortableText v-if="post.body" :value="post.body" />
        </div>
    </div>
</template>

<style>
h3 {
    font-size: large;
    font-weight: 700;
    margin-top: 12px;
    margin-bottom: 12px;
}

h2 {
    font-size: larger;
    font-weight: 700;
    margin-top: 12px;
    margin-bottom: 12px;
}

h2 {
    font-size: x-large;
    font-weight: 700;
    margin-top: 12px;
    margin-bottom: 12px;
}


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
