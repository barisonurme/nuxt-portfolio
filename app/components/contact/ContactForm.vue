<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div
        class="hidden blur opacity-20 light:opacity-10 top-0 absolute xl:flex w-full h-[540px]  -z-10 -translate-y-1/2" />
    <div class="absolute xl:hidden h-dvh w-full top-0 bg-linear-to-b from-primary/10 via-primary/0 to-primary/0" />
    <UCard class="mt-8 bg-muted/30">
        <UForm class="flex flex-col gap-4 w-full mt-4" :state="state" :schema="schema" @submit="onSubmit">
            <UFormField label="Full Name" name="fullName">
                <UInput v-model="state.fullName" class="w-full" placeholder="Your name" />
            </UFormField>

            <UFormField label="Email" name="email">
                <UInput v-model="state.email" class="w-full" placeholder="you@example.com" type="email" />
            </UFormField>

            <UFormField label="Message" name="message">
                <UTextarea v-model="state.message" class="w-full" placeholder="Your message" />
            </UFormField>

            <div class="flex xl:flex-row flex-col w-full justify-end items-center">
                <UButton type="submit" class="px-24" :loading="isLoading" :disabled="isLoading">
                    {{ isLoading ? "Sending..." : "Send" }}
                </UButton>

            </div>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
// Define schema with Zod
const schema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email"),
    message: z.string().min(1, "Message is required"),
});

// Define state
type SchemaType = z.infer<typeof schema>;
const state = reactive<SchemaType>({
    fullName: "",
    email: "",
    message: "",
});

// Loading state
const isLoading = ref(false);

// Nuxt Toast
const toast = useToast()

// onSubmit handler
async function onSubmit(event: FormSubmitEvent<SchemaType>) {
    event.preventDefault();
    isLoading.value = true;

    const siteKey = useRuntimeConfig().public.captchaSiteKey;

    let captchaToken = "";

    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        captchaToken = await new Promise<string>((resolve) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.grecaptcha.ready(() => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                window.grecaptcha.execute(siteKey, { action: "submit" }).then(resolve);
            });
        });
    } catch {
        toast.error({ title: "Error", message: "Captcha failed to load." });
        isLoading.value = false;
        return;
    }

    const data = {
        ...toRaw(state),
        captchaToken,
    };

    try {
        await $fetch("/api/contact-posts", {
            method: "POST",
            body: data,
            headers: { "Content-Type": "application/json" },
            timeout: 5000,
        });

        toast.success({ title: "Success", message: "Message sent successfully!" });

        // Reset form
        state.fullName = "";
        state.email = "";
        state.message = "";
    } catch {
        toast.error({ title: "Error", message: "Failed to send message." });
    } finally {
        isLoading.value = false;
    }
}





onMounted(() => {
    const siteKey = useRuntimeConfig().public.captchaSiteKey

    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    document.head.appendChild(script)
})

</script>
