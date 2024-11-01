import { $, component$, useSignal } from "@builder.io/qwik";
import { DocumentHead, routeLoader$, useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { LuEye, LuMessageSquare, LuSend, LuThumbsDown, LuThumbsUp } from "@qwikest/icons/lucide";
import { Image } from "@unpic/qwik";
import { _ } from "compiled-i18n";
import { Avatar, Badge, Button, Input, Tabs } from "~/components/ui";
import { useSession } from "~/routes/plugin@auth";
import { formatDateISO } from "~/utils";
import Modal from "~/components/modal/modal";
import FormPointOfView from "~/components/forms/FormPointOfView";
import countries from "~/data/countries";
import CardOpinion from "~/components/cards/CardOpinion";

export { useFormLoader, useFormAction } from "~/components/forms/FormPointOfView";
export { useVoteOpinion } from "~/shared/loaders";

type PointOfView = {
    name: string;
    opinions: {
        id: number;
        user: {
            id: number;
            username: string;
            image: string;
        };
        content: string;
        likes: number;
        created_at: string;
        upvotes: number;
        downvotes: number;
        score: number;
    }[];
    color: string;
}

const countryColors: { [key: string]: string } = {
    "Spain": "#F1BF00",
    "Germany": "#000000",
    "USA": "#3C3B6E",
    "Brazil": "#009C3B",
    "Japan": "#BC002D",
    "India": "#FF9933",
    "Australia": "#00008B",
    "South Africa": "#007A4D",
}

export const useGetDebateBySlug = routeLoader$(async (req) => {
    const sharedMap = req.sharedMap;
    const session = sharedMap.get('session');
    const token = session?.accessToken;
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/debates/${req.params.slug}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    return (await response.json()) as {
        description: string;
        dislikes_count: number;
        images: string[];
        language: string;
        likes_count: number;
        public: boolean;
        slug: string;
        status: string;
        title: string;
        type: string;
        views_count: number;
        id: string;
        creator_id: number;
        creator_username: string;
        created_at: string;
        updated_at: string;
        deleted_at?: string;
        tags: string[];
        points_of_view: PointOfView[];
    };
});

const PointOfViewSummary = component$(({ pov }: { pov: PointOfView }) => (
    <div class="mb-4">
        <div style={{ backgroundColor: pov.color, color: 'white' }}>
            <h4 class="font-semibold">{pov.name}</h4>
        </div>
        <div>
            <p class="text-sm text-muted-foreground">
                {pov.opinions.length} comment{pov.opinions.length !== 1 ? 's' : ''}
            </p>
            {pov.opinions.length > 0 && (
                <p class="text-sm mt-2">
                    Latest: "{pov.opinions[pov.opinions.length - 1].content.slice(0, 50)}..."
                </p>
            )}
        </div>
    </div>
))

const PointOfViewDetail = component$(({ pov, userCountry }: { pov: PointOfView; userCountry: string }) => {
    const newComment = useSignal('')

    // const handleSubmitComment = (e) => {
    //     e.preventDefault()
    //     // Aquí iría la lógica para enviar el comentario al backend
    //     newComment.value = ''
    // }

    return (
        <div>
            {pov.opinions.map((opinion) => (
                <div key={opinion.id} class="mb-4 p-4 bg-muted rounded-lg">
                    <div class="flex justify-between items-start">
                        <p class="font-medium">{opinion.user.username}</p>
                        <div class="flex items-center space-x-2">
                            <Button look="ghost" size="icon">
                                <span class="h-4 w-4"><LuThumbsUp /></span>
                            </Button>
                            <span>{opinion.likes}</span>
                            <Button look="ghost" size="icon">
                                <span class="h-4 w-4"><LuThumbsDown /></span>
                            </Button>
                        </div>
                    </div>
                    <p class="mt-2">{opinion.content}</p>
                </div>
            ))}
            {userCountry === pov.name && (
                <form
                    // onSubmit={handleSubmitComment}
                    class="mt-4 flex space-x-2"
                >
                    <Input
                        // value={newComment}
                        // onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment..."
                        class="flex-grow"
                    />
                    <Button type="submit">
                        <span class="h-4 w-4 mr-2"><LuSend /></span>
                        {_`Send`}
                    </Button>
                </form>
            )}
        </div>
    )
})

export default component$(() => {
    const debate = useGetDebateBySlug()

    const userCountry = "Argentina"

    const searchTerm = useSignal('')
    const pointsOfView = useSignal<PointOfView[]>(debate.value.points_of_view)

    const filteredPointsOfView = pointsOfView.value.filter(pov =>
        pov.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )

    const session = useSession();

    const isOpenModalAddDebate = useSignal(false)

    const sortedPOV = [...pointsOfView.value].sort((a, b) => b.opinions.length - a.opinions.length)

    const focusedPOV = useSignal('')

    const handleKeyDown = $((e: KeyboardEvent) => {
        if (focusedPOV.value) {
            const currentIndex = sortedPOV.findIndex(pov => pov.name === focusedPOV.value)
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                focusedPOV.value = sortedPOV[currentIndex - 1].name
            } else if (e.key === 'ArrowRight' && currentIndex < sortedPOV.length - 1) {
                focusedPOV.value = sortedPOV[currentIndex + 1].name
            }
        }
    })

    return (
        <div>
            <div class="overflow-hidden mb-8">
                <div class="relative h-[300px] overflow-hidden rounded-t-lg">
                    <Image
                        alt="Climate Crisis Illustration"
                        class="w-full h-full object-cover"
                        src={debate.value.images && debate.value.images.length ? debate.value.images[0] : 'https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg'}
                        height="1087"
                        width="1932"
                    />
                    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-end p-6">
                        <h1 class="text-3xl font-bold text-white">{debate.value.title}</h1>
                    </div>
                </div>
                <div class="my-4 mx-2">
                    <div class="flex justify-between items-center space-x-4">
                        <div class="flex items-center space-x-4">
                            <Avatar.Root>
                                <Avatar.Image src={session.value?.user?.image ?? ''} alt={`@${debate.value.creator_username ?? ''}`} />
                                <Avatar.Fallback>SC</Avatar.Fallback>
                            </Avatar.Root>
                            <div>
                                <p class="text-sm font-medium">{_`Created by`} @{debate.value.creator_username}</p>
                                <p class="text-xs text-muted-foreground">{formatDateISO(debate.value.created_at)}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                            <span class="flex items-center">
                                <span class="mr-1 h-4 w-4"><LuThumbsUp /></span>
                                {debate.value.likes_count} {_`likes`}
                            </span>
                            <span class="flex items-center">
                                <span class="mr-1 h-4 w-4"><LuThumbsDown /></span>
                                {debate.value.dislikes_count} {_`dislikes`}
                            </span>
                            {/* TODO:  */}
                            <span class="flex items-center">
                                <span class="mr-1 h-4 w-4"><LuMessageSquare /></span>
                                {pointsOfView.value.reduce((acc, pov) => acc + pov.opinions.length, 0)} {_`comments`}
                            </span>
                            <span class="flex items-center">
                                <span class="mr-1 h-4 w-4"><LuEye /></span>
                                {debate.value.views_count} {_`views`}
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="text-muted-foreground mb-4">
                        {debate.value.description}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        {debate.value.tags.map((tag) => (
                            <Badge look="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
                <div class="bg-muted px-2 hidden">
                    <div class="flex justify-between items-center w-full">
                        <p class="text-sm font-medium">Status: {debate.value.status}</p>
                    </div>
                </div>
            </div>

            <h2 class="text-2xl font-bold mb-4">Points of View</h2>

            <div class="overflow-x-auto py-4 w-full whitespace-nowrap rounded-md border mb-4">
                <div class="flex space-x-4 px-4">
                    {sortedPOV.map((pov) => {
                        const flag = countries[pov.name] || ''
                        return (
                            <div
                                key={pov.name}
                                class={`flex items-center mr-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors ${focusedPOV.value === pov.name ? 'bg-blue-100' : ''}`}
                                onClick$={() => {
                                    focusedPOV.value = pov.name;
                                    // scrollToCountry(countryCode);
                                }}
                            >
                                <span class="text-2xl mr-1">{flag ? flag : pov.name}</span>
                                <span class="font-medium">({pov.opinions.length})</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div class="mb-4">
                <div class="relative">
                    <Input
                        type="text"
                        placeholder={_`Search countries...`}
                        value={searchTerm.value}
                        onInput$={(e: Event) => searchTerm.value = (e.target as HTMLInputElement).value}
                        class="pl-10"
                    />
                </div>
            </div>

            <Button
                class="mb-4"
                look="primary"
                onClick$={() => isOpenModalAddDebate.value = true}
            >
                Add your point of view
            </Button>

            {debate.value.points_of_view.length === 0
                ? <p class="text-muted-foreground">No points of view yet</p>
                : (
                    <Tabs.Root class="w-full">
                        <Tabs.List class="grid w-full grid-cols-2">
                            <Tabs.Tab value="summary">{_`Opinions by Country`}</Tabs.Tab>
                            <Tabs.Tab value="details">{_`Overview`}</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel>
                            <div class="overflow-x-auto py-4 w-full whitespace-nowrap rounded-md border" onKeyDown$={handleKeyDown}>
                                <div class="flex space-x-4 p-4">
                                    {sortedPOV.map((pov) => {
                                        const flag = countries[pov.name] || ''
                                        return (
                                            <div
                                                key={pov.name}
                                                class={`w-[300px] flex-shrink-0 transition-all duration-300 ${focusedPOV.value === pov.name ? 'ring-2 ring-blue-500 shadow-lg' : 'ring ring-slate-300'}`}
                                            // ref={el => countryRefs.current[country.code] = el}
                                            >
                                                <div class="p-1">
                                                    <h3 class="text-xl font-bold mb-4 flex items-center">
                                                        <span class="text-2xl mr-2">{flag ? flag : pov.name}</span>
                                                        {pov.name} ({pov.opinions.length})
                                                    </h3>
                                                    <div class="h-[400px]">
                                                        <div class="space-y-4">
                                                            {pov.opinions.map((opinion) => {
                                                                return (
                                                                    <CardOpinion
                                                                        id={opinion.id}
                                                                        username={opinion.user.username}
                                                                        content={opinion.content}
                                                                        createdAt={opinion.created_at}
                                                                        upvotes={opinion.upvotes}
                                                                        downvotes={opinion.downvotes}
                                                                        score={opinion.score}
                                                                    />
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </Tabs.Panel>
                        <Tabs.Panel>
                            {filteredPointsOfView.map((pov) => (
                                <div key={pov.name} class="mb-4">
                                    <div style={{ backgroundColor: pov.color, color: 'white' }}>
                                        <h3 class="text-lg font-semibold">{pov.name}</h3>
                                    </div>
                                    <div>
                                        <PointOfViewDetail pov={pov} userCountry={userCountry} />
                                    </div>
                                </div>
                            ))}
                        </Tabs.Panel>
                    </Tabs.Root>
                )
            }
            <Modal
                description={_`...`}
                isOpen={isOpenModalAddDebate}
                title={_`New Point of View`}
            >
                <FormPointOfView debateId={debate.value.id} />
            </Modal>
        </div>
    )
});

export const head: DocumentHead = ({ resolveValue, params }) => {
    const debate = resolveValue(useGetDebateBySlug);
    return {
        title: debate.title,
        meta: [
            {
                name: 'description',
                content: debate.description,
            },
            {
                name: 'slug',
                content: params.slug,
            },
        ],
    };
};