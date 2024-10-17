import { component$, QRL } from "@builder.io/qwik";

interface ProgressProps {
    label: string;  // The text of the option
    id: number;  // The id of the option
    percentage: number;  // The percentage to be displayed in the bar
    voted?: boolean;  // Indicates if the user has already voted
    onClick$: QRL<(ev: Event, el: HTMLInputElement) => void>;  // Function to be executed on click
}

export const Progress = component$<ProgressProps>(({ label, id, percentage, voted = false, onClick$ }) => {
    return (
        <div
            id={id.toString()}
            class={`relative w-full rounded-full h-8 overflow-hidden cursor-pointer transition-all duration-200 ${voted ? "bg-green-100" : "bg-gray-200 hover:bg-blue-100 active:bg-blue-200"}`}
            onClick$={onClick$}
            // onClick$={() => console.log('HEY!')}
        >
            {/* Progress bar */}
            <div
                class={`absolute top-0 left-0 h-full text-white rounded-full flex items-center px-4 ${percentage > 0 ? (voted ? "bg-green-500" : "bg-blue-500") : ""}`}
                style={{ width: `${percentage}%` }}
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