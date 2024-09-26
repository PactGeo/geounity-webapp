import { $, component$, useSignal } from "@builder.io/qwik";
import { Link, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useGetTags, usePostPoll } from "~/shared/loaders";
import Modal from '~/components/modal/modal';
import NavResources from "~/components/navs/NavResources";
import { useSession } from "~/routes/plugin@auth";
import { Button } from "~/components/ui";
import FormPoll from "~/components/forms/FormPoll";
import { LuPlusCircle } from "@qwikest/icons/lucide";
import EmptyPolls from "~/components/empty-state/EmptyPolls";

export { useGetTags, usePostPoll } from '~/shared/loaders';

export default component$(() => {
    const nav = useNavigate();
    const tags = useGetTags();
    const session = useSession();

    const isOpenModal = useSignal(false);

    const onClickExpand = $(() => nav('/polls/new'))
    const onSubmitCompleted = $(() => isOpenModal.value = false)
    const onClickAction = $(() => isOpenModal.value = !isOpenModal.value)

    const polls = []

    return (
        <div>
            <NavResources />
            <div class="flex-1 overflow-y-auto p-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-5xl font-extrabold text-gray-900 text-center drop-shadow-md">
                        Polls
                    </h1>
                    {polls.length > 0 && (
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
            </div>
            {polls.length === 0 && <EmptyPolls onClickAction={onClickAction} />}
            {session.value?.user ? (
                <Modal
                    description="Share the most important challenge facing your community."
                    isOpen={isOpenModal}
                    onClickExpand={onClickExpand}
                    title="New Poll"
                >
                    <FormPoll onSubmitCompleted={onSubmitCompleted} tags={tags.value} />
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
    )
});

export const head: DocumentHead = {
    title: "Global Polls",
    meta: [
        {
            name: "description",
            content: "Global Polls description",
        },
    ],
};