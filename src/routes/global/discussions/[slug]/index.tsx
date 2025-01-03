import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead} from "@builder.io/qwik-city";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { LuEye, LuMessageSquare, LuSend, LuThumbsDown, LuThumbsUp } from "@qwikest/icons/lucide";
import { Image } from "@unpic/qwik";
import { Avatar, Badge, Button, Input, Tabs } from "~/components/ui";
import { useSession } from "~/routes/plugin@auth";
import { formatDateISO } from "~/utils";

type PointOfView = {
    country: string;
    comments: {
        id: number;
        user: string;
        text: string;
        likes: number;
        dislikes: number;
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
    const response = await fetch(`http://localhost:8000/debates/${req.params.slug}`, {
        headers: {
            Accept: 'application/json',
            Authorization: 'Basic c2ViYToxMjM0NTY='
        },
    });
    return (await response.json()) as Array<{
        id: string;
        type: string;
        title: string;
        slug: string;
        description: string;
        image_url: string;
        public: boolean;
        status: string;
        views_count: number;
        likes_count: number;
        dislikes_count: number;
        last_comment_at: string;
        language: string;
        creator_id: number;
        creator_username: string;
        created_at: string;
        updated_at: string;
    }>;
});

const PointOfViewSummary = component$(({ pov }: { pov: PointOfView }) => (
    <div class="mb-4">
        <div style={{ backgroundColor: pov.color, color: 'white' }}>
            <h4 class="font-semibold">{pov.country}</h4>
        </div>
        <div>
            <p class="text-sm text-muted-foreground">
                {pov.comments.length} comment{pov.comments.length !== 1 ? 's' : ''}
            </p>
            {pov.comments.length > 0 && (
                <p class="text-sm mt-2">
                    Latest: "{pov.comments[pov.comments.length - 1].text.slice(0, 50)}..."
                </p>
            )}
        </div>
    </div>
))

const PointOfViewDetail = component$(({ pov, userCountry }: { pov: PointOfView; userCountry: string }) => {
    const newComment = useSignal('')

    const handleSubmitComment = (e) => {
        e.preventDefault()
        // Aquí iría la lógica para enviar el comentario al backend
        console.log(`New comment for ${pov.country}:`, newComment)
        newComment.value = ''
    }

    return (
        <div>
            {pov.comments.map((comment) => (
                <div key={comment.id} class="mb-4 p-4 bg-muted rounded-lg">
                    <div class="flex justify-between items-start">
                        <p class="font-medium">{comment.user}</p>
                        <div class="flex items-center space-x-2">
                            <Button look="ghost" size="icon">
                                <span class="h-4 w-4"><LuThumbsUp /></span>
                            </Button>
                            <span>{comment.likes}</span>
                            <Button look="ghost" size="icon">
                                <span class="h-4 w-4"><LuThumbsDown /></span>
                            </Button>
                            <span>{comment.dislikes}</span>
                        </div>
                    </div>
                    <p class="mt-2">{comment.text}</p>
                </div>
            ))}
            {userCountry === pov.country && (
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
                        Send
                    </Button>
                </form>
            )}
        </div>
    )
})

export default component$(() => {
    const slug = useLocation().params.slug
    const debate = useGetDebateBySlug()

    const userCountry = "Argentina"

    const searchTerm = useSignal('')
    const pointsOfView = useSignal<PointOfView[]>([
        {
            country: "Spain",
            color: countryColors["Spain"],
            comments: [
                { id: 1, user: "Maria", text: "We need more renewable energy sources.", likes: 5, dislikes: 1 },
                { id: 2, user: "Carlos", text: "Urban planning should prioritize green spaces.", likes: 3, dislikes: 0 },
            ]
        },
        {
            country: "Germany",
            color: countryColors["Germany"],
            comments: [
                { id: 3, user: "Hans", text: "Industry must transition to sustainable practices faster.", likes: 7, dislikes: 2 },
            ]
        },
        {
            country: "USA",
            color: countryColors["USA"],
            comments: [
                { id: 4, user: "Emily", text: "We need stricter regulations on carbon emissions.", likes: 10, dislikes: 3 },
                { id: 5, user: "John", text: "Investing in clean energy creates jobs and boosts the economy.", likes: 8, dislikes: 1 },
            ]
        },
        {
            country: "Brazil",
            color: countryColors["Brazil"],
            comments: [
                { id: 6, user: "Ana", text: "Protecting the Amazon rainforest is crucial for global climate stability.", likes: 15, dislikes: 2 },
            ]
        },
        {
            country: "Japan",
            color: countryColors["Japan"],
            comments: [
                { id: 7, user: "Hiro", text: "We should focus on developing more efficient public transportation systems.", likes: 6, dislikes: 1 },
            ]
        },
        {
            country: "India",
            color: countryColors["India"],
            comments: [
                { id: 8, user: "Priya", text: "Balancing economic growth with environmental protection is our biggest challenge.", likes: 9, dislikes: 3 },
            ]
        },
        {
            country: "Australia",
            color: countryColors["Australia"],
            comments: [
                { id: 9, user: "Emma", text: "We need to invest more in drought-resistant agriculture.", likes: 7, dislikes: 1 },
            ]
        },
        {
            country: "South Africa",
            color: countryColors["South Africa"],
            comments: [
                { id: 10, user: "Thabo", text: "Addressing water scarcity is becoming increasingly urgent.", likes: 11, dislikes: 2 },
            ]
        },
    ])

    const filteredPointsOfView = pointsOfView.value.filter(pov => 
        pov.country.toLowerCase().includes(searchTerm.value.toLowerCase())
    )

    const session = useSession(); // esto deberia obtener la imagen del usuario de la base de datos

    return (
        <div>
            <div class="overflow-hidden mb-8">
                <div class="relative h-[300px] overflow-hidden rounded-t-lg">
                    <Image
                        alt="Climate Crisis Illustration"
                        class="w-full h-full object-cover"
                        src={debate.value.images[0]}
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
                                <p class="text-sm font-medium">Created by @{debate.value.creator_username}</p>
                                <p class="text-xs text-muted-foreground">{formatDateISO(debate.value.created_at)}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                            <span class="flex items-center">
                                <span class="mr-1 h-4 w-4"><LuEye /></span>
                                {debate.value.views_count} views
                            </span>
                            <span class="flex items-center">
                                <span class="mr-1 h-4 w-4"><LuThumbsUp /></span>
                                {debate.value.likes_count} likes
                            </span>
                            <span class="flex items-center">
                                <span class="mr-1 h-4 w-4"><LuThumbsDown /></span>
                                {debate.value.dislikes_count} dislikes
                            </span>
                            <span class="flex items-center">
                                <span class="mr-1 h-4 w-4"><LuMessageSquare /></span>
                                {pointsOfView.value.reduce((acc, pov) => acc + pov.comments.length, 0)} comments
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
                <div class="bg-muted px-2">
                    <div class="flex justify-between items-center w-full">
                        <p class="text-sm font-medium">Status: {debate.value.status}</p>
                    </div>
                </div>
            </div>

            <h2 class="text-2xl font-bold mb-4">Points of View</h2>
            <div class="mb-4">
                <div class="relative">
                    <Input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm.value}
                        onInput$={(e) => searchTerm.value = e?.target?.value }
                        class="pl-10"
                    />
                    <Input class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
            </div>
            <Tabs.Root class="w-full">
                <Tabs.List class="grid w-full grid-cols-2">
                    <Tabs.Tab value="summary">Summary</Tabs.Tab>
                    <Tabs.Tab value="details">Details</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel>
                    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPointsOfView.map((pov) => (
                            <PointOfViewSummary key={pov.country} pov={pov} />
                        ))}
                    </div>
                </Tabs.Panel>
                <Tabs.Panel>
                    {filteredPointsOfView.map((pov) => (
                        <div key={pov.country} class="mb-4">
                            <div style={{ backgroundColor: pov.color, color: 'white' }}>
                                <h3 class="text-lg font-semibold">{pov.country}</h3>
                            </div>
                            <div>
                                <PointOfViewDetail pov={pov} userCountry={userCountry} />
                            </div>
                        </div>
                    ))}
                </Tabs.Panel>
            </Tabs.Root>
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