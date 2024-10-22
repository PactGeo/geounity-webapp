import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import CardPoll from "~/components/cards/CardPoll";

interface ListPolls {
    polls: any[];
    type: string;
}

export default component$<ListPolls>(({
    polls,
    type,
}) => {
    
    const viewMode = useSignal('cards');

    return (
        <div class="flex-1 overflow-y-auto p-4">
            {viewMode.value === 'cards' && (
                <ul class="grid grid-cols-1 gap-6 p-4">
                    {polls.map((poll) => (
                        <li key={`poll-${poll.id}`} class="flex">
                            <CardPoll
                                id={poll.id}
                                slug={poll.slug}
                                title={poll.title}
                                description={poll.description}
                                type={poll.poll_type}
                                is_anonymous={poll.is_anonymous}
                                status={poll.status}
                                votesCount={poll.options.reduce((total: number, option: { votes: number }) => total + option.votes, 0)}
                                likes_count={poll.likes_count}
                                dislikes_count={poll.dislikes_count}
                                options={poll.options}
                                created_at={poll.created_at}
                                ends_at={poll.ends_at}
                                creator_username={poll.creator_username}
                                user_voted_options={poll.user_voted_options}
                                user_reaction_type={poll.user_reaction_type}
                                comments_count={poll.comments_count}
                            />
                        </li>
                    ))}
                </ul>
            )}
            {viewMode.value === 'table' && (
                <h3>Tabla de polls</h3>
            )}
        </div>
    );
});

export const head: DocumentHead = {
    title: "Welcome to Qwik",
    meta: [
        {
            name: "description",
            content: "Qwik site description",
        },
    ],
};