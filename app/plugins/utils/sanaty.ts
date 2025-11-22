import { createClient } from '@sanity/client'

const config = useRuntimeConfig()
export const client = createClient({
  projectId: config.public.sanityProjectId,
  dataset: config.public.sanityDataset,
  useCdn: true
})