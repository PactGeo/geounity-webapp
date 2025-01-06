import { $, component$, useStylesScoped$ } from "@builder.io/qwik";
import { LuArrowUpCircle, LuArrowDownCircle } from '@qwikest/icons/lucide';
import styles from "./card-discussion.css?inline";
import { formatDateISO } from "~/utils";
import { Button } from "~/components/ui";
import { useVoteOpinion } from "~/shared/loaders";


interface CardOpinionProps {
    id: number;
    username: string;
    content: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    score: number;
}

export default component$<CardOpinionProps>(({
    id,
    username,
    content,
    createdAt,
    upvotes,
    downvotes,
    score
}) => {
    useStylesScoped$(styles);
    const actionVoteOpinion = useVoteOpinion();

    const handleUpVote = $(async () => {
        await actionVoteOpinion.submit({ opinionId: id, value: 1 });
    })

    const handleDownVote = $(async () => {
        await actionVoteOpinion.submit({ opinionId: id, value: -1 });
    })

    return (
        <div key={`opinion-${id}`} class="p-4 border rounded-md">
            <div class="flex justify-between items-start mb-2">
                <span class="font-semibold">{username}</span>
                <span class="text-sm text-gray-500">
                    {formatDateISO(createdAt)}
                </span>
            </div>
            <p class="mb-2">{content}</p>
            <Button
                look="outline" 
                size="sm"
                onClick$={handleUpVote}
            >
                <span class="text-xl"><LuArrowUpCircle />{upvotes}</span>
            </Button>
            <Button
                look="outline" 
                size="sm"
                onClick$={handleDownVote}
            >
                <span class="text-xl"><LuArrowDownCircle />{downvotes}</span>
            </Button>
            <p>
                <span class="text-xl">Score: {score}</span>
            </p>
        </div>
    );
});
