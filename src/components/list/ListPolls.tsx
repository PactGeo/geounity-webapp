import { component$, useSignal } from "@builder.io/qwik";
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

    console.log('type', type);

    return (
        <div class="flex-1 overflow-y-auto p-4">
            {viewMode.value === 'cards' && (
                <ul class="grid grid-cols-1 gap-6 p-4">
                    {polls.map((poll) => (
                        <li key={`poll-${poll.id}`} class="flex">
                            <CardPoll
                                poll={poll}
                                id={poll.id}
                                slug={poll.slug}
                                title={poll.title}
                                description={poll.description}
                                type={poll.poll_type}
                                is_anonymous={poll.is_anonymous}
                                status={poll.status}
                                likes_count={poll.likes_count}
                                dislikes_count={poll.dislikes_count}
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
            {/* TODO: create table view */}
            {viewMode.value === 'table' && (
                <h3>Tabla de polls</h3>
            )}
        </div>
    );
});
