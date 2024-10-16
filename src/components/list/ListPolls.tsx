import { $, component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useNavigate } from '@builder.io/qwik-city';
import CardPoll from "~/components/cards/CardPoll";
import EmptyDebates from "~/components/empty-state/EmptyDebates";
import FormDebateGlobal from "~/components/forms/FormDebateGlobal";
import Modal from '~/components/modal/modal';
import { useSession } from "~/routes/plugin@auth";
import TableDebates from "~/components/table/TableDebates";
import { Button } from "~/components/ui";
import { LuPlusCircle } from "@qwikest/icons/lucide";

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
                <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                    {polls.map((poll) => (
                        <li key={`debate-${poll.id}`} class="flex">
                            <CardPoll
                                slug={poll.slug}
                                title={poll.title}
                                description={poll.description}
                                type={poll.poll_type}
                                is_anonymous={poll.is_anonymous}
                                status={poll.status}
                                created_at={poll.created_at}
                                ends_at={poll.ends_at}
                                images={poll.images}
                                creator_username={poll.creator_username}
                                comments_count={poll.comments_count}
                                last_comment_at={poll.last_comment_at}
                                tags={poll.tags}
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