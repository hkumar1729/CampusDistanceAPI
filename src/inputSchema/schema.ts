import { z } from "zod";

const schema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    latitude: z.number().min(-90).max(90).default(0), 
    longitude: z.number().min(-180).max(180).default(0),
})
export default schema;