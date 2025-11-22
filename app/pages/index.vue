<!-- eslint-disable vue/first-attribute-linebreak -->

<template>
    <div class="relative flex flex-col justify-center items-center w-full h-full">
        <img class="absolute object-contain z-10 h-[720px] top-0 w-2/6 translate-y-1/2"
            src="https://github.githubassets.com/assets/particles-de1dd20f3008.png" alt="temp-partical">
        <div class="blur light:opacity-50 top-0 absolute flex w-full h-[540px] translate-y-12">

        </div>
        <HeaderView />

        <div class="flex w-full h-full justify-center items-center z-10 mt-44">
            <div
                class="flex w-full max-w-7xl bg-inverted/5 border border-muted/80 border-t-white/30 border-b-none rounded-4xl rounded-b-none p-8 pb-0 backdrop-blur-3xl [540px]">
                <div
                    class="flex flex-col gap-4 w-full max-w-7xl bg-default rounded-2xl shadow-2xl light:shadow-none rounded-b-none p-8 backdrop-blur-3xl h-full">
                    <div class="flex w-full justify-start items-center">
                        <p class="tracking-wider text-2xl py-6 font-black text-primary">WORKS</p>
                    </div>
                    <div class="grid grid-cols-12 gap-4">
                        <WorksView />
                    </div>

                </div>
            </div>

        </div>
        <div class="flex w-full border-muted/50 border-t" />

        <div class="flex flex-col items-center w-full justify-center p-24 min-h-[740px] border-b border-muted/50">
            <div class="flex gap-24 items-center flex-col w-full max-w-7xl">
                <div class="flex flex-col items-center">
                    <p class="text-5xl text-primary font-bold">Tech <span class="text-default">Stack</span></p>
                    <p class="opacity-50 text-xl mt-4">These are some of the technologies I use on a daily basis.</p>
                </div>
                <TechStack />

            </div>

        </div>
        <div class="flex w-full min-h-[540px] max-w-7xl border-x border-muted/50">
            <div class="grid grid-cols-12 w-full">
                <div class="col-span-4 h-full border-r border-muted/50">
                    <div class="flex justify-center items-center w-full h-1/2 border-b border-muted/50">
                        <p class="text-6xl text-primary font-semibold">About<span class="text-default">Me</span></p>
                    </div>
                    <div class="flex justify-center items-center w-full h-1/2">
                        <p class="group text-2xl font-semibold hover:underline cursor-pointer items-center flex">Contact
                            <UIcon name="i-lucide-chevron-right"
                                class="text-primary size-5 group-hover:translate-x-1/2 duration-500" />
                        </p>
                    </div>
                </div>
                <div class="col-span-8">
                    <AboutView />
                </div>
            </div>
        </div>


    </div>

</template>

<script lang="ts" setup>



</script>


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