import { $, component$ } from "@builder.io/qwik";
import { LuThumbsUp, LuThumbsDown, LuMessageSquare, LuShare, LuMoreVertical } from '@qwikest/icons/lucide';
import { useNavigate } from "@builder.io/qwik-city";
import { timeAgo } from "~/utils";
import { Badge } from "~/components/ui";
import { Progress } from "~/components/Progress";

interface CardPollProps {
    slug: string;
    title: string;
    description: string;
    type: string;
    is_anonymous: boolean;
    status: string;
    votesCount: number;
    options: { text: string; votes: number }[];
    created_at: string;
    ends_at: string;
    creator_username: string;
    comments_count: number;
}

export default component$<CardPollProps>(({
    slug,
    title,
    description,
    type,
    is_anonymous,
    status,
    votesCount,
    options,
    created_at,
    ends_at,
    creator_username,
    comments_count
}) => {
    const nav = useNavigate();
    const onClickUsername = $((username: string) => nav(`/profile/${username}`));

    // Calcular el porcentaje de votos por opción
    const totalVotes = options.reduce((acc, option) => acc + option.votes, 0) || 1; // Evitar división por 0
    const getPercentage = (votes: number) => Math.round((votes / totalVotes) * 100);

    return (
        <div class="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow w-full">
            {/* Title and type badge */}
            <h2 class="text-xl font-semibold text-gray-800 flex items-center justify-between">
                {title}
                <Badge look="secondary">{type}</Badge>
            </h2>

            {/* Description */}
            <p class="text-gray-600 text-sm mt-2">{description}</p>

            {/* Cantidad de votos */}
            <p class="text-gray-500 text-xs mt-1">{votesCount} votos</p>

            {/* Opciones con porcentajes */}
            <div class="space-y-2 mt-4">
                {options.map((option, idx) => (
                    <Progress key={idx} label={option.text} percentage={getPercentage(option.votes)} />
                ))}
            </div>

            {/* Información del usuario y fecha */}
            <div class="flex justify-between items-center mt-4 text-gray-500 text-xs">
                {!is_anonymous && (
                    <div class="flex items-center">
                        <span onClick$={() => onClickUsername(creator_username)} class="cursor-pointer">
                            {creator_username}
                        </span>
                        <span class="ml-2">{timeAgo(new Date(created_at))}</span>
                    </div>
                )}
                {/* Mostrar fecha de finalización si existe */}
                {ends_at && <span class="ml-2">Finaliza: {new Date(ends_at).toLocaleDateString()}</span>}
            </div>

            {/* Botones de interacción */}
            <div class="flex items-center justify-between mt-4">
                <div class="flex space-x-4">
                    <button class="text-gray-600 hover:text-blue-500">
                        <LuThumbsUp class="h-5 w-5" />
                    </button>
                    <button class="text-gray-600 hover:text-red-500">
                        <LuThumbsDown class="h-5 w-5" />
                    </button>
                    <button class="text-gray-600 hover:text-green-500">
                        <LuShare class="h-5 w-5" />
                    </button>
                    <button class="text-gray-600 hover:text-purple-500">
                        <LuMessageSquare class="h-5 w-5" />
                    </button>
                </div>
                <div class="relative">
                    <button class="text-gray-600 hover:text-gray-800">
                        <LuMoreVertical class="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
});
