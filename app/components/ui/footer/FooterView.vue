<template>
    <!-- eslint-disable vue/first-attribute-linebreak -->
    <USeparator type="dashed" class="h-px" icon="i-custom:custom-icon" />


    <UFooter class="flex w-full items-center justify-center">
        <template #left>
            <div class="flex flex-col py-4">
                <UIcon name="i-custom:custom-icon" class="size-12! text-primary!" />
                <p class="text-muted text-sm">
                    barisonurme.com
                </p>
            </div>
        </template>

        Copyright © {{ new Date().getFullYear() }}

        <template #right>

            <UButton icon="i-simple-icons-github" color="neutral" variant="ghost" to="https://github.com/nuxt/nuxt"
                target="_blank" aria-label="GitHub" />

            <UButton color="neutral" variant="ghost" to="https://www.linkedin.com/in/brsnrm" target="_blank"
                icon="i-simple-icons-linkedin" aria-label="Linkedin" />

        </template>
    </UFooter>
</template>
