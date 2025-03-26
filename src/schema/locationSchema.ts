import {z} from "zod";

export const locationSchema = z.object({
    region: z.string(),
    province: z.string().optional(),
    lgu: z.string(),
    legislativeDistrict: z.number(),
    councilorDistrict: z.number(),
    provincialDistrict: z.number().optional()
});