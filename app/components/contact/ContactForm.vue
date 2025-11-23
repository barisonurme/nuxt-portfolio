<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="px-4 pb-4">
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

                <div class="flex xl:flex-row flex-col-reverse gap-4 w-full justify-between items-center">
                    <div class="flex items-center gap-2">
                        <!-- TODO: Add tooltip to inform user here -->
                        <p class="text-xs opacity-50">This form is protected with <strong>reCatpcha</strong></p>
                        <UIcon name="i-fluent:info-12-regular" class="opacity-50" />
                    </div>
                    <UButton type="submit" class="px-24" :loading="isLoading" :disabled="isLoading">
                        {{ isLoading ? "Sending..." : "Send" }}
                    </UButton>

                </div>
            </UForm>
        </UCard>
    </div>
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

    script.onload = () => {
        const badge = document.getElementById("recaptcha-token") as HTMLElement
        if (badge) {
            badge.style.bottom = "10px"
            badge.style.left = "10px"
            badge.style.right = "auto"
        }
    }
})

</script>
