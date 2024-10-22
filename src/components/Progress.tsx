import { component$, QRL } from "@builder.io/qwik";

interface ProgressProps {
    label: string;  // The text of the option
    id: number;  // The id of the option
    voted?: boolean;  // Indicates if the user has already voted
    votes: number;  // The number of votes of the option
    votesCount: number;  // The total number of votes
    onClick$: QRL<(ev: Event, el: HTMLInputElement) => void>;  // Function to be executed on click
}

export const Progress = component$<ProgressProps>(({ label, id, voted = false, votes, votesCount, onClick$ }) => {
    const percentage = Math.round((votes / (votesCount || 1)) * 100);
    return (
        <div
            id={id.toString()}
            class={`relative w-full rounded-sm h-12 overflow-hidden cursor-pointer transition-all duration-200 border bg-white hover:bg-blue-100 active:bg-blue-200`}
            onClick$={onClick$}
        >
            {/* Progress bar */}
            <div
                class={`absolute top-0 left-0 h-full text-white rounded-sm flex items-center px-4 ${percentage > 0 ? (voted ? "bg-blue-200 border border-blue-400" : "bg-gray-200") : ""}`}
                style={{ width: `${percentage}%`, pointerEvents: 'none' }}
            >
                {/* Show label even if percentage is 0 */}
                <span class="text-gray-800 whitespace-nowrap">{label}</span>
            </div>

            {/* The percentage always at the end of the bar */}
            <div class="absolute top-0 right-4 h-full flex items-center text-gray-800">
                <span class="text-sm">{percentage}%</span>
            </div>
        </div>
    );
});