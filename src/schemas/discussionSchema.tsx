import * as v from 'valibot'
import { _ } from "compiled-i18n";
import { CommunityType } from '~/constants';
import type { NoSerialize } from '@builder.io/qwik';

const isBlob = (input: unknown) => input instanceof Blob;

export const MAX_TITLE_LENGTH = 100
export const MAX_DESCRIPTION_LENGTH = 5000

export const DiscussionSchema = v.object({
    title: v.pipe(
        v.string(),
        v.nonEmpty(_`Please enter a title.`),
        v.minLength(5, _`Your password must have 5 characters or more.`),
        v.maxLength(MAX_TITLE_LENGTH, _`Your password must have ${MAX_TITLE_LENGTH} characters or less.`),
    ),
    description: v.pipe(
        v.string(),
        v.maxLength(5000, _`Your password must have 5000 characters or less.`),
    ),
    tags: v.array(v.string()),
    file: v.object({
        images: v.optional(v.array(v.custom<NoSerialize<Blob>>(isBlob))),
    }),
    scope: v.enum(CommunityType),
    is_anonymous: v.boolean(),
    public: v.boolean()
});

export type DiscussionForm = v.InferInput<typeof DiscussionSchema>;