import {z} from "zod";

export const senatorFilterSchema = z.object({
    count: z.number().min(1),
    page: z.number().min(1),
    name: z.string().optional(),
    order: z.string(),
    sortBy: z.string()
});