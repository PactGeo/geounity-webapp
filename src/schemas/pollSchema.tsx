import * as v from 'valibot'
import { PollType } from '~/constants';
import { _ } from "compiled-i18n";

export const PollSchema = v.object({
    type: v.enum(PollType),
    title: v.pipe(
        v.string(),
        v.nonEmpty(_`Please enter a title.`),
        v.minLength(5, _`Your password must have 5 characters or more.`),
        v.maxLength(100, _`Your password must have 100 characters or less.`),
    ),
    description: v.pipe(
        v.string(),
        v.maxLength(5000, _`Your password must have 5000 characters or less.`),
    ),
    options: v.pipe(
        v.array(
            v.pipe(v.string(), v.nonEmpty(_`Please enter a name for the option.`))
        ),
        v.minLength(2, _`You must have at least 2 options.`),
        v.maxLength(10, _`You must have at most 10 options.`),
    ),
    community: v.string(),
    endDate: v.object({
        active: v.boolean(),
        value: v.string(),
    })
});

export type PollForm = v.InferInput<typeof PollSchema>;