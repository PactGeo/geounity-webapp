import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { useLocation, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import Modal from '~/components/modal/modal';
import NavResources from "~/components/navs/NavResources";
import { Button, Tabs } from "~/components/ui";
import FormPoll from "~/components/forms/FormPoll";
import { LuPlus } from "@qwikest/icons/lucide";
import EmptyPolls from "~/components/empty-state/EmptyPolls";
import ListPolls from "~/components/list/ListPolls";
import { useGetPolls, useGetTags } from '~/shared/loaders';
import { _ } from "compiled-i18n";
import ListTags from "~/components/list/ListTags";
import { UserContext } from "~/contexts/UserContext";
import SocialLoginButtons from "~/components/SocialLoginButtons";

export { useGetTags, useGetPolls, usePostPoll, useVotePoll, useReactToPoll, useFormPollLoader } from '~/shared/loaders';
export { useFormPollAction, useRemovePollAction } from "~/shared/actions";

export default component$(() => {
    const nav = useNavigate();
    const loc = useLocation();

    const user = useContext(UserContext);
    const polls = useGetPolls();

    const selectedIndexSig = useSignal(0);
    
    const tags = useGetTags();
    const filteredPolls = useSignal(polls.value);
    
    const selectedTag = useStore({ id: 0, name: 'all' });
    
    useTask$(async ({ track }) => {
        track(() => selectedIndexSig.value);
        const pathname = loc.url.pathname;
        const segments = pathname.split('/').filter(Boolean);
        const communityType = segments[0]
        const url = new URL(`${import.meta.env.PUBLIC_API_URL}/polls`);
        if (selectedTag.name && selectedTag.name !== 'all') {
            url.searchParams.append('tags', selectedTag.name);
        }
        if (communityType) {
            url.searchParams.append('scope', communityType);
        }
        if(selectedIndexSig.value !== 0) {
            const getFilter = (index: number) => {
                switch (index) {
                    case 1:
                        return 'pending';
                    case 2:
                        return 'answered';
                    case 3:
                        return 'finished';
                    case 4:
                        return 'my_polls';
                    default:
                        return '';
                }
            }
            url.searchParams.append('filter', getFilter(selectedIndexSig.value));
        }
        // const res = await fetch(url.toString(), {
        //     headers: {
        //         Accept: 'application/json',
        //     },
        // });
        // const json = await res.json();
        // console.log('json', json[0])
        filteredPolls.value = []

        // Assigning to a signal will trigger a re-render.
        // listOfUsers.value = json.results;
    });

    const isOpenModal = useSignal(false);
    const onClickExpand = $(() => nav('/polls/new'));
    const onSubmitCompleted = $(() => isOpenModal.value = false);
    const onClickAction = $(() => isOpenModal.value = !isOpenModal.value);

    return (
        <div class="">
            <NavResources />
            <h1 class="mt-4 ml-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 drop-shadow-md">
                {_`Polls Global`}
            </h1>
            <ListTags tags={tags.value} selectedTag={selectedTag} />
            <div class="flex-1 px-4 mb-4">
                <div class="flex justify-between items-center text-xl">
                    {_`Total polls: ${polls.value.length}`}
                    {(polls.value.length > 0 || selectedTag.name !== "all") && (
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
            {polls.value.length === 0 && (
                selectedTag.name !== 'all'
                    ? <div class="flex justify-center">
                        <span>{_`No results for ${selectedTag.name}`}</span>
                    </div>
                    : <EmptyPolls onClickAction={onClickAction} />
            )}
            {polls.value.length > 0 && (
                <Tabs.Root
                    onSelectedIndexChange$={(index) => {
                        selectedIndexSig.value = index;
                    }}
                >
                    <Tabs.List class="mx-4 grid grid-cols-5">
                        <Tabs.Tab value="all">{_`All`}</Tabs.Tab>
                        <Tabs.Tab>{_`Pending`}</Tabs.Tab>
                        <Tabs.Tab>{_`Answered`}</Tabs.Tab>
                        <Tabs.Tab>{_`Finished`}</Tabs.Tab>
                        <Tabs.Tab>{_`My polls`}</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel>
                        <ListPolls polls={polls.value} type="GLOBAL" />
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <ListPolls polls={filteredPolls.value} type="GLOBAL" />
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <ListPolls polls={filteredPolls.value} type="GLOBAL" />
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <ListPolls polls={filteredPolls.value} type="GLOBAL" />
                    </Tabs.Panel>
                    <Tabs.Panel>
                        <ListPolls polls={filteredPolls.value} type="GLOBAL" />
                    </Tabs.Panel>
                </Tabs.Root>
            )}
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
                    description={_`You must log in to create a new global poll.`}
                    isOpen={isOpenModal}
                    title={_`You must log in`}
                >
                    <SocialLoginButtons />
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
