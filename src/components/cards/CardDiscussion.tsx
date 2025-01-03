import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import { LuCalendar, LuMessageSquare, LuUser, LuTag } from '@qwikest/icons/lucide';
import styles from "./card-discussion.css?inline";
import { useNavigate } from "@builder.io/qwik-city";
import { timeAgo } from "~/utils";

interface CardDiscussionProps {
    title: string;
    description: string;
    images?: string;
    creator_username: string;
    created_at: string;
    comments_count: number;
    last_comment_at?: string;
    tags: string[];
    slug: string;
    scope?: string;
}

export default component$<CardDiscussionProps>(({
    title,
    description,
    // images,
    creator_username,
    created_at,
    comments_count,
    last_comment_at,
    tags,
    // slug,
    scope
}) => {
    useStylesScoped$(styles);
    const nav = useNavigate();
    const onClickUsername = $((username: string) => nav(`/user/${username}`));

    // const mainImage = images && images.length > 0 ? images[0] : false;

    return (
        <div class="p-4 mb-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-shadow w-full">
            {/* Title and type badge */}
            <h2 class="text-3xl font-semibold text-gray-800 flex items-center justify-between">
                {title}
                {scope === "GLOBAL" && <span>🌎</span>}
            </h2>

            {/* Description */}
            <p class="mb-2 text-gray-600 text-sm">{description}</p>

            {/* Tags */}
            <div class="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span key={tag} class="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                        <LuTag class="inline-block mr-1" /> {tag}
                    </span>
                ))}
            </div>

            {/* User info and created at */}
            <div class="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <div class="flex items-center">
                    <LuUser class="h-5 w-5" />
                    <span onClick$={() => onClickUsername(creator_username)} class="cursor-pointer">
                        {creator_username}
                    </span>
                    <div class="flex items-center">
                        <LuCalendar class="h-5 w-5 ml-4 mr-1" />
                        <span>{timeAgo(new Date(created_at))}</span>
                    </div>
                </div>
                {last_comment_at && (
                    <div class="flex items-center">
                        <LuMessageSquare class="h-5 w-5 ml-4 mr-1" />
                        Last comment: {timeAgo(new Date(last_comment_at))}
                    </div>
                )}
            </div>

            {/* Interaction buttons */}
            <div class="flex justify-between items-center mt-4">
                <div class="flex space-x-8">
                    <button class="hover:text-blue-500 flex items-center text-gray-600">
                        <LuMessageSquare class="h-5 w-5" />
                        <span class="ml-1">{comments_count} comments</span>
                    </button>
                </div>
            </div>
        </div>
    );
});
