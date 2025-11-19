<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
    error: NuxtError
}>()
</script>

<template>
    <UApp>

        <UError :error="error" style="max-height: 80vh; overflow-y: auto;" />


        <UFooter />
    </UApp>
</template>
