import { $, component$, useSignal } from "@builder.io/qwik";
import { routeAction$, useNavigate } from "@builder.io/qwik-city";
import { LuThumbsUp, LuThumbsDown, LuMessageSquare, LuShare, LuMoreVertical } from '@qwikest/icons/lucide';
import { timeAgo } from "~/utils";
import { Badge } from "~/components/ui";
import { Progress } from "~/components/Progress";
import { useReactToPoll, useVotePoll } from "~/shared/loaders";

interface CardPollProps {
    id: number;
    slug: string;
    title: string;
    description: string;
    type: string;
    is_anonymous: boolean;
    status: string;
    votesCount: number;
    likes_count: number;
    dislikes_count: number;
    options: { id: number, text: string; votes: number }[];
    created_at: string;
    ends_at: string;
    creator_username: string;
    comments_count: number;
    user_voted_options: number[];
    user_reaction_type: string | null;
}

interface CommentRead {
    id: number;
    poll_id: number;
    user_id: number;
    username: string;
    content: string;
    created_at: string;
}

export default component$<CardPollProps>(({
    id,
    slug,
    title,
    description,
    type,
    is_anonymous,
    status,
    votesCount,
    likes_count,
    dislikes_count,
    options,
    created_at,
    ends_at,
    creator_username,
    comments_count,
    user_voted_options,
    user_reaction_type
}) => {
    console.log('##### CARD POLL #####')
    console.log('id', id)
    console.log('options', options)
    console.log('type', type)
    console.log('user_voted_options', user_voted_options)
    const nav = useNavigate();
    const actionVote = useVotePoll();
    const actionReact = useReactToPoll();

    const likesCount = useSignal(likes_count);
    const dislikesCount = useSignal(dislikes_count);
    const votedOptions = useSignal<number[]>(user_voted_options);  // Options voted by the user
    const userReaction = useSignal<string | null>(user_reaction_type);  // Reaction of the user (like or dislike)
    const showComments = useSignal(false);
    const comments = useSignal<CommentRead[]>([]);
    const newCommentContent = useSignal('');

    const onClickUsername = $((username: string) => nav(`/profile/${username}`));

    const handleVote = $(async (ev: Event) => {
        const optionId = Number((ev.target as HTMLElement).id);
        console.log('optionId', optionId)
        console.log(333)
        if(type === 'BINARY' || type === 'SINGLE_CHOICE') {
            if (!votedOptions.value.includes(optionId)) {
                votedOptions.value = [optionId];
            } else {
                votedOptions.value = [];
            }
            const result = await actionVote.submit({ pollId: id, optionIds: [optionId] });
            console.log('result1', result)
        } else if (type === 'MULTIPLE_CHOICE') {
            if (!votedOptions.value.includes(optionId)) {
                const newValues = [...votedOptions.value, optionId]
                votedOptions.value = newValues;
                const result = await actionVote.submit({ pollId: id, optionIds: newValues });
                console.log('result3', result)
            } else {
                const newValues = votedOptions.value.filter((id) => id !== optionId)
                votedOptions.value = newValues;
                const result = await actionVote.submit({ pollId: id, optionIds: newValues });
                console.log('result4', result)
            }
        } else {
            console.error('Invalid poll type');
        }
    });

    const handleReaction = $(async (reactionType: string) => {
        console.log('handleReaction')
        console.log('reactionType', reactionType)
        const result = await actionReact.submit({ pollId: id, reactionType });
        console.log('result', result)
        if (result.value.detail === "Reaction canceled successfully") {
            if (reactionType === 'LIKE') {
                likesCount.value -= 1;
            } else if (reactionType === 'DISLIKE') {
                dislikesCount.value -= 1;
            }
            userReaction.value = null;
        } else if (result.value.detail === "Reaction updated successfully") {
            if (userReaction.value === 'LIKE') {
                likesCount.value -= 1;
                dislikesCount.value += 1;
            } else if (userReaction.value === 'DISLIKE') {
                dislikesCount.value -= 1;
                likesCount.value += 1;
            } else {
                if (reactionType === 'LIKE') {
                    likesCount.value += 1;
                } else if (reactionType === 'DISLIKE') {
                    dislikesCount.value += 1;
                }
            }
            userReaction.value = reactionType;
        } else if (result.value.detail === "Reaction recorded successfully") {
            if (reactionType === 'LIKE') {
                likesCount.value += 1;
            } else if (reactionType === 'DISLIKE') {
                dislikesCount.value += 1;
            }
            userReaction.value = reactionType;
        }
    });

    const toggleComments = $(() => {
        showComments.value = !showComments.value;
        if (showComments.value) {
            // TODO: Cargar comentarios cuando se muestra la sección
            // loadComments();
        }
    });

    const addComment = $(async (event: Event) => {
        // TODO: Enviar comentario
    });

    return (
        <div class="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-shadow w-full">
            {/* Title and type badge */}
            <h2 class="text-xl font-semibold text-gray-800 flex items-center justify-between">
                {title}
                <Badge look="secondary">{type}</Badge>
            </h2>

            {/* Description */}
            <p class="text-gray-600 text-sm mt-2">{description}</p>

            {/* TODO: translate this */}
            {/* Cantidad de votos */}
            <p class="text-gray-500 text-xs mt-1">{votesCount} votos</p>

            {/* Opciones con porcentajes */}
            <div class="space-y-2 mt-4">
                {options.map((option) => (
                    <Progress
                        key={`option-${option.id}`}
                        id={option.id}
                        label={option.text}
                        votes={option.votes}
                        votesCount={votesCount}
                        voted={votedOptions.value.includes(option.id)}
                        onClick$={handleVote}
                    />
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
                {/* TODO: translate this */}
                {/* Mostrar fecha de finalización si existe */}
                {ends_at && <span class="ml-2">Finaliza: {new Date(ends_at).toLocaleDateString()}</span>}
            </div>

            {/* Botones de interacción */}
            <div class="flex items-center justify-between mt-4">
                <div class="flex space-x-4">
                    <button
                        class={`hover:text-blue-500 flex items-center ${userReaction.value === 'LIKE' ? 'text-blue-500' : 'text-gray-600'}`}
                        onClick$={() => handleReaction('LIKE')}
                    >
                        <LuThumbsUp class="h-5 w-5" />
                        <span class="ml-1">{likesCount.value}</span>
                    </button>
                    <button
                        class={`hover:text-red-500 flex items-center ${userReaction.value === 'DISLIKE' ? 'text-red-500' : 'text-gray-600'}`}
                        onClick$={() => handleReaction('DISLIKE')}
                    >
                        <LuThumbsDown class="h-5 w-5" />
                        <span class="ml-1">{dislikesCount.value}</span>
                    </button>
                    <button
                        class="hover:text-purple-500 flex items-center text-gray-600"
                        onClick$={toggleComments}
                    >
                        <LuMessageSquare class="h-5 w-5" />
                        <span class="ml-1">{comments_count}</span>
                    </button>
                    <button class="text-gray-600 hover:text-green-500">
                        <LuShare class="h-5 w-5" />
                    </button>
                </div>
                <div class="relative">
                    <button class="text-gray-600 hover:text-gray-800">
                        <LuMoreVertical class="h-5 w-5" />
                    </button>
                </div>
            </div>
            {showComments.value && (
                <div class="mt-4">
                    <div class="space-y-2">
                        {comments.value.map((comment) => (
                            <div key={comment.id} class="border-b pb-2">
                                <p class="text-sm text-gray-800">{comment.content}</p>
                                <div class="text-xs text-gray-500">
                                    {comment.username} • {timeAgo(new Date(comment.created_at))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form preventdefault:submit onSubmit$={addComment} class="mt-4">
                        <textarea
                            class="w-full p-2 border rounded"
                            placeholder="Add a comment..."
                            bind:value={newCommentContent}
                        ></textarea>
                        <button type="submit" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                            Enviar
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
});
