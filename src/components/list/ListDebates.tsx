import { component$, useSignal } from "@builder.io/qwik";
import CardDebate from "~/components/cards/CardDebate";

interface ListDebates {
    debates: any[];
    type: string;
}

export default component$<ListDebates>(({
    debates,
    type
}) => {

    const viewMode = useSignal('cards');

    return (
        <div class="flex-1 overflow-y-auto p-4">
            {viewMode.value === 'cards' && (
                <ul class="grid grid-cols-1 gap-6 p-4">
                    {debates.map((debate) => (
                        <li key={`debate-${debate.id}`} class="flex">
                            <CardDebate
                                title={debate.title}
                                description={debate.description}
                                images={debate.images}
                                creator_username={debate.creator_username}
                                created_at={debate.created_at}
                                comments_count={debate.comments_count}
                                last_comment_at={debate.last_comment_at}
                                tags={debate.tags}
                                slug={debate.slug}
                            />
                        </li>
                    ))}
                </ul>
            )}
            {/* TODO: create table view */}
            {viewMode.value === 'table' && (
                <h3>Tabla de debates</h3>
            )}
        </div>
    );
});