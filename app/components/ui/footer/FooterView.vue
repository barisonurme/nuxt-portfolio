<template>
    <!-- eslint-disable vue/first-attribute-linebreak -->
    <USeparator type="dashed" class="h-px" />


    <UFooter class="flex w-full items-center justify-center">
        <template #left>
            <div class="flex items-center xl:items-start flex-col py-4">
                <Logo class="w-10 h-10 text-primary" />
                <p class="text-muted text-sm">
                    barisonurme.com
                </p>
                <p class="xl:hidden block mt-8 text-xs">Copyright © {{ new Date().getFullYear() }}</p>
            </div>
        </template>

        <p class="xl:block hidden">Copyright © {{ new Date().getFullYear() }}</p>

        <template #right>
            <div class="xl:block hidden">
                <UButton icon="i-simple-icons-github" color="neutral" variant="ghost" to="https://github.com/nuxt/nuxt"
                    target="_blank" aria-label="GitHub" />

                <UButton color="neutral" variant="ghost" to="https://www.linkedin.com/in/brsnrm" target="_blank"
                    icon="i-simple-icons-linkedin" aria-label="Linkedin" />
            </div>

        </template>
    </UFooter>
</template>


<script setup>
import Logo from '~/assets/logo.svg'
</script>