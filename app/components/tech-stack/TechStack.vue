<script setup lang="ts">
const testimonials = ref([

    {
        user: {
            name: "Dan Abramov",
            description: "Creator of Redux",
            avatar: {
                src: "https://overreacted.io/avi.jpg",
                alt: "Dan Abramov",
            }
        },
        quote:
            "His Redux Toolkit usage is so clean it made me question whether I created it wrong. I’ve never felt simultaneously proud and disrespected."
    },
    {
        user: {
            name: "Ryan Dahl",
            description: "Creator of Node.js",
            avatar: {
                src: "https://cdn.cloudinary.com/stichting-frontend-amsterdam/image/upload/v1674813354/dev/Dahl_Ryan_wg0lg5.png",
                alt: "Ryan Dahl"
            }
        },
        quote:
            "His Express backend runs so smoothly I thought he discovered threads in JavaScript. Turns out he just writes code that makes the rest of us look lazy."
    },
    {
        user: {
            name: "TanStack Team",
            description: "Makers of TanStack Query",
            avatar: {
                src: 'https://avatars.githubusercontent.com/u/5580297?v=4',
                alt: 'Tanner Linsley'
            },
        },
        quote:
            "We saw his TanStack Query setup and immediately wondered if we should retire. Nobody should understand caching that well without a medical license."
    },
    {
        user: {
            name: "Adam Wathan",
            description: "Creator of Tailwind CSS",
            avatar: {
                src: "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
                alt: "Adam Wathan"
            }
        },
        quote:
            "His Tailwind classes look like a keyboard fell down the stairs, yet the UI is immaculate. I don't know whether to applaud or call an exorcist."
    },
    {
        user: {
            name: "GraphQL Foundation",
            description: "Stewards of GraphQL",
            avatar: {
                src: 'https://miro.medium.com/v2/resize:fill:64:64/1*r3FlTD2XFPg7lMn2hy1MkA.jpeg',
                alt: "Nick Schrock",
            }
        },
        quote:
            "His GraphQL queries were so elegant our entire spec started blushing. We considered rewriting the docs, but we’re not ready for that kind of humility."
    },
    {
        user: {
            name: "Firebase Team",
            description: "Google Developers",
            avatar: {
                src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW6eyjw-sncwZxtTnaQj66DdHF2PJ0uL6PGQ&s",
                alt: "Firebase Team"
            }
        },
        quote:
            "He prototypes with Firebase so fast we thought he discovered undocumented APIs. HR asked us to stop comparing ourselves to him."
    },
    {
        user: {
            name: "Unity Technologies",
            description: "Makers of Unity Engine",
            avatar: {
                src: "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/256x256/1190760c9cec0e50f44d55e2bf9df185",
                alt: "Unity Technologies"
            }
        },
        quote:
            "He pushes C# and Unity so hard our physics engine started filing union paperwork. No developer should bend a game engine like that."
    },
    {
        user: {
            name: "Colin McDonnell",
            description: "Creator of Zod",
            avatar: {
                src: "https://media.licdn.com/dms/image/v2/C5603AQHAQ5gkW-f5WQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1660084315286?e=1765411200&v=beta&t=xPvWr9jP3zqbwkBMlFolfimwCq6KxJAXGE7bpt35AoU",
                alt: "Colin McDonnell"
            }
        },
        quote:
            "His validation schemas are so strict and beautiful they made our own examples feel like toddlers scribbling with crayons."
    },
    {
        user: {
            name: "Drizzle ORM Team",
            description: "TypeScript ORM",
            avatar: {
                src: "https://miro.medium.com/v2/resize:fill:128:128/1*WQQ9SJGFM_JUAdjsObrbkw.jpeg",
                alt: "Drizzle ORM"
            }
        },
        quote:
            "His SQL schemas were so clean we wondered if he formatted them with tweezers. No ORM should have to experience this level of perfectionism."
    },
    {
        user: {
            name: "Jarred Sumner",
            description: "Creator of Bun",
            avatar: {
                src: "https://images.crunchbase.com/image/upload/c_thumb,h_256,w_256,f_auto,g_face,z_0.7,q_auto:eco,dpr_1/tmm7txjklbg0npleiee0?ik-sanitizeSvg=true",
                alt: "Jarred Sumner"
            }
        },
        quote:
            "He runs Bun so fast I checked the benchmarks twice to make sure he wasn’t DOS’ing himself. Nobody should outperform my own demos."
    },
    {
        user: {
            name: "Yusuke Wada",
            description: "Creator of Hono",
            avatar: {
                src: "https://cdn.cloudinary.com/stichting-frontend-amsterdam/image/upload/v1740046648/Yusuke_Wada_tpbba1.png",
                alt: "Yusuke Wada"
            }
        },
        quote:
            "His Hono routes were so minimal I thought he forgot to write them. Then they benchmarked so high I questioned my career choices."
    },
    {
        user: {
            name: "Guillermo Rauch",
            description: "CEO of Vercel, Creator of Next.js",
            avatar: {
                src: 'https://turso.tech/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fguilermo-rauch.1aea6645.jpg&w=96&q=75',
                alt: 'Guillermo Rauch'
            },
        },
        quote:
            "I saw his Next.js skills and briefly wondered if he was the reason devs keep filing issues asking for features we never planned. Nobody should navigate routing with that much confidence."
    },
])

</script>

<template>
    <UPageColumns>


        <UPageCard
            class="group hover:border-primary/50! border border-muted/50 bg-muted/20 opacity-80 hover:opacity-100 duration-500 transition-all "
            v-for="(testimonial, index) in testimonials" :key="index" variant="subtle" :description="testimonial.quote"
            :ui="{
                description: 'before:content-[open-quote] after:content-[close-quote]',
                leadingIcon: 'size-10 text-primary!',
            }">
            <template #footer>
                <UUser v-bind="testimonial.user" size="xl"
                    :ui="{ name: 'group-hover:text-primary! duration-500 transition-all ', avatar: 'duration-500 transition-all saturate-0 group-hover:saturate-100' }" />
            </template>
        </UPageCard>

    </UPageColumns>
</template>
