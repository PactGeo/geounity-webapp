import { $, component$, useComputed$, useContext, useSignal, useStore } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LuThumbsUp, LuThumbsDown, LuMessageSquare, LuTag, LuUser, LuTimer, LuShare2, LuTrash2, LuFlag } from '@qwikest/icons/lucide';
import { timeAgo } from "~/utils";
import { Progress } from "~/components/Progress";
import { useReactToPoll, useVotePoll } from "~/shared/loaders";
import { _ } from "compiled-i18n";
import { Button } from "~/components/ui";
import { UserContext } from "~/contexts/UserContext";
import { ConfirmationModal } from "~/components/modal/ConfirmationModal";
import Modal from "~/components/modal/modal";
import { useRemovePollAction } from "~/shared/actions";
import FormReport from "~/components/forms/FormReport";
import FormShare from "../forms/FormShare";
import { CommunityType } from "~/constants";
// import FormShare from "~/components/forms/FormShare";

interface CardPollProps {
    poll: any;
    id: number;
    slug: string;
    title: string;
    description: string;
    type: string;
    is_anonymous: boolean;
    status: string;
    likes_count: number;
    dislikes_count: number;
    // options: { id: number, text: string; votes: number }[];
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
    title,
    description,
    type,
    is_anonymous,
    likes_count,
    dislikes_count,
    created_at,
    ends_at,
    creator_username,
    comments_count,
    user_voted_options,
    user_reaction_type,
    poll
}) => {
    const nav = useNavigate();
    const user = useContext(UserContext);

    const actionVote = useVotePoll();
    const actionReact = useReactToPoll();
    const removePollAction = useRemovePollAction()

    const pollState = useStore({ poll });

    const likesCount = useSignal(likes_count);
    const dislikesCount = useSignal(dislikes_count);
    const userVotedOptions = useSignal<number[]>(user_voted_options);
    const userReaction = useSignal<string | null>(user_reaction_type);
    const showComments = useSignal(false);
    const comments = useSignal<CommentRead[]>(poll.comments);
    const newCommentContent = useSignal('');
    const isOpenModalSharePoll = useSignal(false);
    const isOpenModalDeletePoll = useSignal(false);
    const isOpenModalReportPoll = useSignal(false);

    const onClickUsername = $((username: string) => nav(`/profile/${username}`));

    const votesCount = useComputed$(() =>
        pollState.poll.options.reduce((total: number, option: { votes: number }) => total + option.votes, 0)
    )

    const handleVote = $(async (ev: Event) => {
        const optionId = Number((ev.target as HTMLElement).id);
        let result;
        
        if(type === 'BINARY' || type === 'SINGLE_CHOICE') {
            if (!userVotedOptions.value.includes(optionId)) {
                userVotedOptions.value = [optionId];
            } else {
                userVotedOptions.value = [];
            }
            result = await actionVote.submit({ pollId: id, optionIds: [optionId] });
        } else if (type === 'MULTIPLE_CHOICE') {
            let newValues;
            if (!userVotedOptions.value.includes(optionId)) {
                newValues = [...userVotedOptions.value, optionId]
            } else {
                newValues = userVotedOptions.value.filter((id) => id !== optionId)
            }
            userVotedOptions.value = newValues;
            result = await actionVote.submit({ pollId: id, optionIds: newValues });
        } else {
            console.error('Invalid poll type');
            return;
        }
        // Update optionsStore.options with the updated options from the backend
        if (result.value.detail === "Vote updated successfully") {
            pollState.poll.options = result.value.options;
        } else if (result.value.detail ===  "Vote canceled successfully") {
            pollState.poll.options = result.value.options;
        } 
        else {
            console.error('Error')
        }
    });

    const handleReaction = $(async (reactionType: string) => {
        const result = await actionReact.submit({ pollId: id, reactionType });
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
            // Cargar comentarios
        }
    });

    const addComment = $(async (event: Event) => {
        console.log('++++++++++++ addComment ++++++++++++')
        console.log('event:', event)
        // TODO: Enviar comentario
    });

    const listOptions = useComputed$(() => {
        // Create a shallow copy to avoid mutating the original array
        return [...pollState.poll.options]
            // Sort the copied array by 'id' in ascending order
            .sort((a, b) => a.id - b.id)
            // Map the sorted array to the desired format
            .map((option) => ({
                id: option.id,
                text: option.text,
                votes: option.votes,
            }));
    });

    const isOwner = creator_username === user.username

    const handleDelete = $(async () => {
        await removePollAction.submit({ pollId: id });
    })

    const handleCancel = $(() => {});

    // const handleReportar = $(async () => {
    //     console.log('++++++++++++ handleReportar ++++++++++++')
    //     console.log('Estas reportando el poll con ID:  ', id)
    // })

    const totalVotos = useComputed$(() => {
        return votesCount.value + userVotedOptions.value.length;
    })

    const onSubmitCompleted = $(() => {isOpenModalReportPoll.value = false;isOpenModalSharePoll.value = false;});

    return (
        <div class="p-4 mb-4 border rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-shadow w-full">
            {/* Title and type badge */}
            <h2 class="text-3xl font-semibold text-gray-800 flex items-center justify-between">
                {title}
                <span class="badge text-xl">
                    {poll.scope === CommunityType.GLOBAL && <span>🌎</span>}
                </span>
            </h2>

            {/* Description */}
            <p class="mb-2 text-gray-600 text-sm">{description}</p>

            {/* Tags */}
            <div class="mb-3 flex flex-wrap gap-2">
                {poll.tags?.map((tag: string) => (
                    <span key={tag} class="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                        <LuTag class="inline-block mr-1" /> {tag}
                    </span>
                ))}
            </div>
            
            {/* Cantidad de votos */}
            <p class="mb-2 text-gray-500 text-xs">{_`${votesCount.value} votes`}</p>

            {/* Opciones con porcentajes */}
            <div class="space-y-2 mb-4">
                {listOptions.value.map((option) => {
                    return (
                        <Progress
                            key={`option-${option.id}`}
                            option={option}
                            votesCount={votesCount.value}
                            userVotedOptions={userVotedOptions.value}
                            onClick$={handleVote}
                        />
                    )
                })}
            </div>

            {/* Información del usuario y fecha */}
            <div class="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <div class="flex items-center">
                    <LuUser class="h-5 w-5" />
                    {is_anonymous
                        ? <span>{_`Anonymous User`}</span>
                        : (
                            <span onClick$={() => onClickUsername(creator_username)} class="cursor-pointer">
                                {creator_username}
                            </span>
                        )
                    }
                    <div class="flex items-center"><LuTimer class="h-5 w-5 ml-4 mr-1" /><span>{timeAgo(new Date(created_at))}</span></div>
                </div>
                {ends_at && <span class="ml-2 text-green-500">{_`Finaliza: ${new Date(ends_at).toLocaleDateString()}`}</span>}
            </div>

            {/* Botones de interacción */}
            <div class="flex justify-between items-center mt-4">
                <div class="flex space-x-8">
                    <Button
                        class={`hover:text-blue-500 flex items-center ${userReaction.value === 'LIKE' ? 'text-blue-500' : 'text-gray-600'}`}
                        look="ghost"
                        onClick$={() => handleReaction('LIKE')}
                    >
                        <LuThumbsUp class="h-5 w-5" />
                        <span class="ml-1">{likesCount.value}</span>
                    </Button>
                    <Button
                        class={`hover:text-red-500 flex items-center ${userReaction.value === 'DISLIKE' ? 'text-red-500' : 'text-gray-600'}`}
                        look="ghost"
                        onClick$={() => handleReaction('DISLIKE')}
                    >
                        <LuThumbsDown class="h-5 w-5" />
                        <span class="ml-1">{dislikesCount.value}</span>
                    </Button>
                    <Button
                        class="hover:text-purple-500 flex items-center text-gray-600"
                        look="ghost"
                        onClick$={toggleComments}
                    >
                        <LuMessageSquare class="h-5 w-5" />
                        <span class="ml-1">{comments_count}</span>
                    </Button>
                    <Button look="ghost" onClick$={() => isOpenModalSharePoll.value = true} class="text-gray-600 hover:text-green-500">
                        <LuShare2 class="h-5 w-5" />
                    </Button>
                    {isOwner ? (
                        <Button look="ghost" onClick$={() => isOpenModalDeletePoll.value = true}>
                            <LuTrash2 class="h-5 w-5 text-red-500" />
                        </Button>
                        ) : (
                        <Button look="ghost" onClick$={() => isOpenModalReportPoll.value = true}>
                            <LuFlag class="h-5 w-5 text-yellow-500" />
                        </Button>
                    )}
                </div>
                <div class="relative">
                    <button class="text-gray-600 hover:text-gray-800">
                        {_`${totalVotos.value} total votes`}
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
                            {_`Send`}
                        </button>
                    </form>
                </div>
            )}
            <Modal
                isOpen={isOpenModalSharePoll}
                title={_`Share Poll`}
            >
                <FormShare
                    share_link={`http://localhost:5173/global/polls/${poll.slug}`}
                />
            </Modal>
            <ConfirmationModal
                isOpen={isOpenModalDeletePoll}
                title={_`Confirm Deletion`}
                description={_`Are you sure you want to delete this item? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={handleCancel}
            />
            <Modal
                isOpen={isOpenModalReportPoll}
                title={_`Report Poll`}
            >
                <FormReport
                    content_id={id}
                    onSubmitCompleted={onSubmitCompleted}
                />
            </Modal>
        </div>
    );
});
