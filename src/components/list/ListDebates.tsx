import { $, component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link, useNavigate } from '@builder.io/qwik-city';
import CardDebate from "~/components/cards/CardDebate";
import EmptyDebates from "~/components/empty-state/EmptyDebates";
import FormDebateGlobal from "~/components/forms/FormDebateGlobal";
import Modal from '~/components/modal/modal';
import { useSession } from "~/routes/plugin@auth";
import TableDebates from "~/components/table/TableDebates";
import { Button } from "~/components/ui";
import { LuPlusCircle } from "@qwikest/icons/lucide";

interface ListDebates {
    title: string;
    debates: any[];
    tags: { id: string, name: string }[];
}

export default component$<ListDebates>(({
    tags = [],
    debates,
    title = "Debate List",
}) => {
    const nav = useNavigate();
    const session = useSession();
    
    const viewMode = useSignal('cards');
    const isOpenModal = useSignal(false);
    
    const onClickAction = $(() => isOpenModal.value = !isOpenModal.value)
    const onClickExpand = $(() => nav('/debates/new'))
    const onSubmitCompleted = $(() => isOpenModal.value = false)

    return (
        <div class="flex-1 overflow-y-auto p-4">
            <div class="flex justify-between items-center">
                <h1 class="text-5xl font-extrabold text-gray-900 text-center drop-shadow-md">
                    {title}
                </h1>
                {debates.length > 0 && (
                    <Button
                        class="mr-4"
                        look="primary"
                        onClick$={() => isOpenModal.value = true}
                    >
                        <LuPlusCircle class="text-4xl mr-2" />
                        Create
                    </Button>
                )}
            </div>
            {debates.length === 0 && <EmptyDebates onClickAction={onClickAction} />}
            {viewMode.value === 'cards' && (
                <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
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
            {viewMode.value === 'table' && (
                <TableDebates
                    debates={debates.map(d => ({ id: d.id, title: d.title, creator_name: session.value?.user?.name ?? '', created_at: d.created_at, comments_count: d.comments_count, last_comment_at: d.last_comment_at, tags: ['tag1', 'tag2'] }))}
                />
            )}
            {session.value?.user ? (
                <Modal
                    description="Share the most important challenge facing your community."
                    isOpen={isOpenModal}
                    onClickExpand={onClickExpand}
                    title="New Debate"
                >
                    <FormDebateGlobal
                        onSubmitCompleted={onSubmitCompleted}
                        tags={tags}
                    />
                </Modal>
            ) : (
                <Modal
                    description="You must log in to create a new debate"
                    isOpen={isOpenModal}
                    title="You must log in"
                >
                    <Button look="primary">
                        <Link href="/login/">Log in</Link>
                    </Button>
                </Modal>
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