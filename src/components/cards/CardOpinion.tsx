import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import { LuCalendar, LuMessageSquare, LuUser, LuTag, LuThumbsUp } from '@qwikest/icons/lucide';
import styles from "./card-debate.css?inline";
import { Link, useNavigate } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import { getFlagByName, timeAgo } from "~/utils";
import { Button } from "~/components/ui";


interface CardOpinionProps {
    id: number;
    username: string;
    content: string;
    createdAt: string;
}

export default component$<CardOpinionProps>(({
    id,
    username,
    content,
    createdAt,
}) => {
    useStylesScoped$(styles);
    const nav = useNavigate();

    return (
        <div key={`opinion-${id}`} class="p-4 border rounded-md">
            <div class="flex justify-between items-start mb-2">
                <span class="font-semibold">{username}</span>
                <span class="text-sm text-gray-500">
                    {createdAt}
                </span>
            </div>
            <p class="mb-2">{content}</p>
            <Button
                look="primary" 
                size="sm"
                // onClick$={() => handleUpvote(country.code, comment.id)}
            >
                <LuThumbsUp class="mr-2 h-4 w-4" /> {'opinion.upvotes'}
            </Button>
        </div>
    );
});
