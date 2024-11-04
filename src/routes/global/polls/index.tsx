import { $, component$, useContext, useSignal, useStore } from "@builder.io/qwik";
import { Link, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import Modal from '~/components/modal/modal';
import NavResources from "~/components/navs/NavResources";
import { Button } from "~/components/ui";
import FormPoll from "~/components/forms/FormPoll";
import { LuPlus } from "@qwikest/icons/lucide";
import EmptyPolls from "~/components/empty-state/EmptyPolls";
import ListPolls from "~/components/list/ListPolls";
import { useGetPolls, useGetTags } from '~/shared/loaders';
import { _ } from "compiled-i18n";
import ListTags from "~/components/list/ListTags";
import { UserContext } from "~/contexts/UserContext";

export { useGetTags, useGetPolls, usePostPoll, useVotePoll, useReactToPoll, useFormPollLoader } from '~/shared/loaders';
export { useFormPollAction } from "~/shared/actions";

export default component$(() => {
    const nav = useNavigate();
    const user = useContext(UserContext);

    const tags = useGetTags();
    const polls = useGetPolls();

    const selectedTag = useStore({ id: 0, name: 'all' });
    console.log('selectedTag', selectedTag)

    const isOpenModal = useSignal(false);
    const onClickExpand = $(() => nav('/polls/new'));
    const onSubmitCompleted = $(() => isOpenModal.value = false);
    const onClickAction = $(() => isOpenModal.value = !isOpenModal.value);

    return (
        <div>
            <NavResources />
            <ListTags tags={tags.value} selectedTag={selectedTag} />
            <div class="flex-1 overflow-y-auto p-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-center drop-shadow-md">
                        {_`Polls Global`}
                    </h1>
                    {polls.value.length > 0 && (
                        <Button
                            class="mr-4"
                            look="primary"
                            onClick$={() => isOpenModal.value = true}
                        >
                            <LuPlus class="text-2xl mr-2" />
                            {_`Create`}
                        </Button>
                    )}
                </div>
            </div>
            {polls.value.length === 0 && (selectedTag.name !== 'all' ? <div>VACIO</div> : <EmptyPolls onClickAction={onClickAction} />)}
            <ListPolls polls={polls.value} type="GLOBAL" />
            {user.isAuthenticated ? (
                <Modal
                    description={_`Share an important question to gather the global community's opinion. Your poll can help identify common challenges and priorities.`}
                    isOpen={isOpenModal}
                    onClickExpand={onClickExpand}
                    title={_`Create a New Global Poll`}
                >
                    <FormPoll
                        onSubmitCompleted={onSubmitCompleted}
                        tags={tags.value}
                    />
                </Modal>
            ) : (
                <Modal
                    description={_`You must log in to create a new debate`}
                    isOpen={isOpenModal}
                    title={_`You must log in`}
                >
                    <Button look="primary">
                        <Link href="/login/">{_`Login`}</Link>
                    </Button>
                </Modal>
            )}
        </div>
    )
});

export const head: DocumentHead = {
    title: _`Global Polls`,
    meta: [
        {
            name: "description",
            content: _`Global Polls description`,
        },
    ],
};
