import * as v from 'valibot'

export const CountrySchema = v.object({
    country: v.string(),
});

export type CountryForm = v.InferInput<typeof CountrySchema>;