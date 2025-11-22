import { createClient } from '@sanity/client'

export const useSanityClient = () => {
  const config = useRuntimeConfig() // safe, called inside function
  const client = createClient({
    projectId: config.public.sanityProjectId,
    dataset: config.public.sanityDataset,
    useCdn: true
  })
  return client
}
