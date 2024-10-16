import { $, component$ } from "@builder.io/qwik";
import { LuCalendar, LuMessageSquare, LuUser, LuTag } from '@qwikest/icons/lucide';
import { Link, useNavigate } from "@builder.io/qwik-city";
import { Image } from "@unpic/qwik";
import { timeAgo } from "~/utils";


interface CardPollProps {
    slug: string;
    title: string;
    description: string;
    type: string;
    is_anonymous: boolean;
    status: string;
    created_at: string;
    ends_at: string;
    images: string;
    creator_username: string;
    comments_count: number;
    last_comment_at: string;
    tags: string[];
    countries_involved?: string[];
}

export default component$<CardPollProps>(({
    slug,
    title,
    description,
    type,
    is_anonymous,
    status,
    created_at,
    ends_at,
    images,
    creator_username,
    comments_count,
    last_comment_at,
    tags,
    countries_involved
}) => {
    const nav = useNavigate();
    const onClickUsername = $((username: string) => nav(`/profile/${username}`))

    const mainImage = images?.[0]

    return (
        <Link href={`/debates/${slug}`}>
            <div class="border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col justify-between">
                <div>
                    {mainImage && (
                        <Image
                            alt={title}
                            _class="w-full h-48 object-cover rounded-t-lg"
                            src={mainImage}
                            height="576"
                            width="864"
                        />
                    )}
                    <h2 class="mt-2 px-4 text-xl font-semibold text-gray-800">{title}</h2>
                    <p class="px-4 text-gray-600 my-2 text-sm line-clamp-3">{description}</p>
                </div>
                <div class="px-4 my-2 flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                        <span key={tag} class="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                            <LuTag class="inline-block mr-1" /> {tag}
                        </span>
                    ))}
                </div>
                <div class="px-4 py-2 flex justify-between items-center text-gray-500 text-xs">
                    <div>
                        <div onClick$={() => onClickUsername(creator_username)}>
                            <span class="flex items-center cursor-pointer">
                                <LuUser class="mr-1" />
                                {creator_username}
                            </span>
                        </div>
                        <span class="flex items-center mt-1">
                            <LuCalendar class="mr-1" />
                            {timeAgo(new Date(created_at))}
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="flex items-center">
                            <LuMessageSquare class="mr-1" />
                            {comments_count ?? 0} comments
                        </span>
                        {last_comment_at && (
                            <span class="flex items-center mt-1">
                                <LuCalendar class="mr-1" />
                                Last comment: {timeAgo(new Date(last_comment_at))}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
});
