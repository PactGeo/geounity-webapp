import { _ } from "compiled-i18n";
import * as v from "valibot";

export enum ReasonType {
    Offensive = "offensive",
    Spam = "spam",
    Misinformation = "misinformation",
}

export enum ContentType {
    Poll = "poll",
    Debate = "debate",
    Project = "project",
}

export const ReportSchema = v.object({
    content_type: v.enum(ContentType),
    content_id: v.pipe(
        v.string(),
        v.nonEmpty(_`Please provide the content ID.`)
    ),
    reason: v.enum(ReasonType),
    description: v.pipe(
        v.string(),
        v.maxLength(500, _`Description must be 500 characters or less.`)
    )
});

export type ReportForm = v.InferInput<typeof ReportSchema>;
