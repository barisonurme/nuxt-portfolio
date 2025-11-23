<template>
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

        <div class="flex w-full justify-end">
            <UButton type="submit" class="mt-4 px-24" :loading="isLoading" :disabled="isLoading">
                {{ isLoading ? "Sending..." : "Send" }}
            </UButton>
        </div>
    </UForm>
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

    // Convert reactive state to plain object
    const data = toRaw(state);

    try {
        const res = await $fetch("/api/contact-posts", {
            method: "POST",
            body: data,
            headers: { "Content-Type": "application/json" },
            timeout: 5000, // optional timeout
        });

        toast.success({ title: "Success", message: "Message sent successfully!" });
        console.log("Submitted:", res);

        // Reset form
        state.fullName = "";
        state.email = "";
        state.message = "";
    } catch (err) {
        console.error("Submit error:", err);
        toast.error({ title: "Error", message: "Failed to send message." });
    } finally {
        isLoading.value = false;
    }
}

</script>
