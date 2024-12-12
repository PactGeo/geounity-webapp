import * as v from 'valibot'

export const UserSchema = v.object({
    name: v.string(),
    bio: v.string(),
    location: v.string(),
    website: v.string(),
    banner: v.string(),
    image: v.string(),
    username: v.string(),
});

export type UserForm = v.InferInput<typeof UserSchema>;