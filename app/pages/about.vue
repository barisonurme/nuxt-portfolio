<template>
    <div class="flex flex-col w-full max-w-7xl">
        <UPageHeader :ui="{ container: 'px-4', headline: 'px-4' }" class="flex flex-col w-full" title="About Me"
            description="Have questions or want to collaborate? Send me a message, and I'll get back to you soon!"
            headline="About me" />

        <div class="flex w-full h-full justify-center items-center px-4">
            <UAlert title="Under Construction!" description="About Page Under Construction."
                icon="ix:maintenance-triangle" :ui="{
                    icon: 'size-11'
                }" />
        </div>
    </div>
</template>
<script lang="ts" setup>



</script>
<style></style>