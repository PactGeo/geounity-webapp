import { $, component$, Resource, useResource$, useSignal } from "@builder.io/qwik";
import { Link, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useGetTags, useGetDiscussions } from "~/shared/loaders";
import ListTags from "~/components/list/ListTags";
import NavResources from "~/components/navs/NavResources";
import { Button } from "~/components/ui";
import { LuPlusCircle } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import EmptyDebates from "~/components/empty-state/EmptyDebates";
import ListDebates from "~/components/list/ListDebates";
import { useSession } from "~/routes/plugin@auth";
import Modal from "~/components/modal/modal";
import FormDebate from "~/components/forms/FormDebate";
import { title } from "process";

export { useFormLoader, useFormAction } from "~/components/forms/FormDebate";
export { useGetTags, useGetDiscussions } from '~/shared/loaders';

export default component$(() => {
    const nav = useNavigate();
    const session = useSession();
    const tags = useGetTags();

    const debates = useGetDiscussions();

    const selectedTag = useSignal('all');
    console.log('selectedTag', selectedTag.value)
    const isOpenModal = useSignal(false);
    const onClickExpand = $(() => nav('/discussions/new'))
    const onSubmitCompleted = $(() => isOpenModal.value = false)
    const onClickAction = $(() => isOpenModal.value = !isOpenModal.value)

    const getDebeteByTag = useResource$<string>(async ({ track }) => {
        console.log('####################################getDebeteByTag###################################')
        track(() => selectedTag.value)

        if(selectedTag.value === 'all') {
            const token = session?.value?.accessToken;
            console.log('token', token)
            // const response = await fetch(`http://localhost:8000/debates/global`, {
            //     headers: {
            //         method: 'GET',
            //         Accept: 'application/json',
            //         Authorization: `Bearer ${token}`
            //     }
            // });
            return ['a']
            console.log('response', response)
            const data = await response.json();
            console.log('data1', data)
            return data
        }
        // const response = await fetch(`http://localhost:8000/debates?debate_type=GLOBAL&tag=${selectedTag.value}`);
        // const data = await response.json();
        // console.log('data', data)
        return []
        // return data
    })

    return (
        <div>
            <NavResources />
            <ListTags tags={tags.value} selectedTag={selectedTag} />
            <div class="flex-1 overflow-y-auto p-4">
                <div class="flex justify-between items-center">
                    {debates.value.length > 0 && (
                        <Button
                            class="mr-4"
                            look="primary"
                            onClick$={() => isOpenModal.value = true}
                        >
                            <LuPlusCircle class="text-4xl mr-2" />
                            {_`Create`}
                        </Button>
                    )}
                </div>
            </div>
            {debates.value.length === 0 && <EmptyDebates onClickAction={onClickAction} />}
            <ListDebates debates={debates.value} type="GLOBAL" />
            <Resource
                value={getDebeteByTag}
                onPending={() => <div>{_`Loading...`}</div>}
                onRejected={() => <div>Failed to load weather</div>}
                // onResolved={debates => <ListDebates debates={debates} type="GLOBAL" />}
                onResolved={debates => <p>{JSON.stringify(debates)}</p>}
            />
            {session.value?.user ? (
                <Modal
                    description={_`Share the most important challenge facing your community.`}
                    isOpen={isOpenModal}
                    onClickExpand={onClickExpand}
                    title={_`New Debate`}
                >
                    <FormDebate onSubmitCompleted={onSubmitCompleted} tags={tags.value} />
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