<script setup>
import { PortableText } from '@portabletext/vue'
import { useRoute } from 'vue-router'
import { client } from '~/plugins/utils/sanaty'

const route = useRoute()
const slug = route.params.slug

const { data: post, error } = await useAsyncData(`post-${slug}`, async () => {
    try {
        const query = `*[_type == "post" && slug.current == $slug][0]{
            title, description, body, publishedAt
            }`
        return await client.fetch(query, { slug })
    } catch (err) {
        console.error('Sanity fetch error:', err)
        return null
    }
})
console.log('post :', post);

if (error.value) {
    // Handle gracefully
    console.warn(error.value)
}

</script>

<template>
    <div class="flex flex-col w-full max-w-7xl justify-center">
        <div class="flex flex-col w-full p-8">

            <h1 class="text-xl text-primary font-black">{{ post.title }}</h1>

            <p>{{ post.description }}</p>

            <PortableText :value="post.body" />
        </div>
    </div>
</template>
