import { _ } from 'compiled-i18n';
import * as v from 'valibot'

export const MAX_USERNAME_LENGTH = 50;
export const MAX_NAME_LENGTH = 50;
export const MAX_BIO_LENGTH = 240;
export const MAX_LOCATION_LENGTH = 40
export const MAX_WEBSITE_LENGTH = 100;

export const UserSchema = v.object({
    username: v.pipe(
        v.string(),
        v.nonEmpty(_`Username can’t be blank`),
        v.maxLength(MAX_USERNAME_LENGTH, _`Username can’t be longer than ${MAX_USERNAME_LENGTH} characters`),
    ),
    name: v.pipe(
        v.string(),
        v.nonEmpty(_`Name can’t be blank`),
        v.maxLength(MAX_NAME_LENGTH, _`Name can’t be longer than ${MAX_NAME_LENGTH} characters`),
    ),
    bio: v.pipe(
        v.string(),
        v.maxLength(MAX_BIO_LENGTH, _`Bio can’t be longer than ${MAX_BIO_LENGTH} characters`),
    ),
    location: v.pipe(
        v.string(),
        v.maxLength(MAX_LOCATION_LENGTH, _`Location can’t be longer than ${MAX_LOCATION_LENGTH} characters`),
    ),
    website: v.pipe(
        v.string(),
        v.maxLength(MAX_WEBSITE_LENGTH, _`Location can’t be longer than ${MAX_WEBSITE_LENGTH} characters`),
    ),
    // banner: v.string(),
    // image: v.string(),
});

export type UserForm = v.InferInput<typeof UserSchema>;