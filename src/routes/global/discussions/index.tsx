import { $, component$, useContext, useSignal, useStore } from "@builder.io/qwik";
import { Link, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useGetTags, useGetDiscussions } from "~/shared/loaders";
import ListTags from "~/components/list/ListTags";
import NavResources from "~/components/navs/NavResources";
import { Button } from "~/components/ui";
import { LuPlus } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import EmptyDebates from "~/components/empty-state/EmptyDebates";
import ListDebates from "~/components/list/ListDebates";
import Modal from "~/components/modal/modal";
import FormDiscussion from "~/components/forms/FormDiscussion";
import { UserContext } from "~/contexts/UserContext";

export { useGetTags, useGetDiscussions, useFormDiscussionLoader } from '~/shared/loaders';
export { useFormDiscussionAction } from '~/shared/actions';

export default component$(() => {
    const nav = useNavigate();
    const user = useContext(UserContext);

    const tags = useGetTags();
    const debates = useGetDiscussions();

    const selectedTag = useStore({ id: 0, name: 'all' });

    const isOpenModal = useSignal(false);
    const onClickExpand = $(() => nav('/discussions/new'))
    const onSubmitCompleted = $(() => isOpenModal.value = false)
    const onClickAction = $(() => isOpenModal.value = !isOpenModal.value)

    return (
        <div>
            <NavResources />
            <h1 class="mt-4 ml-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 drop-shadow-md">
                {_`Discussions Global`}
            </h1>
            <ListTags tags={tags.value} selectedTag={selectedTag} />
            <div class="flex-1 px-4 mb-4">
                <div class="flex justify-between items-center text-xl">
                    {_`Total polls: ${debates.value.length}`}
                    {(debates.value.length > 0 || selectedTag.name !== "all") && (
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
            {debates.value.length === 0 && (
                selectedTag.name !== 'all'
                    ? <div class="flex justify-center">
                        <span>{_`No results for ${selectedTag.name}`}</span>
                    </div>
                    : <EmptyDebates onClickAction={onClickAction} />
            )}
            <ListDebates debates={debates.value} type="GLOBAL" />
            {user.isAuthenticated ? (
                <Modal
                    description={_`Share the most important challenge facing your community.`}
                    isOpen={isOpenModal}
                    onClickExpand={onClickExpand}
                    title={_`Create a New Global Discussion`}
                >
                    <FormDiscussion
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
    title: _`Global Discussions`,
    meta: [
        {
            name: "description",
            content: _`Global Discussions description`,
        },
    ],
};