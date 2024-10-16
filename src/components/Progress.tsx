import { component$ } from "@builder.io/qwik";

interface ProgressProps {
    label: string;  // El texto de la opción
    percentage: number;  // El porcentaje que se debe mostrar en la barra
}

export const Progress = component$<ProgressProps>(({ label, percentage }) => {
    return (
        <div class="relative w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            {/* Progress bar */}
            {percentage > 0 && (
                <div
                    class="absolute top-0 left-0 h-full bg-blue-500 text-white rounded-full flex items-center justify-start px-4"
                    style={{ width: `${percentage}%` }}
                >
                    {/* The label stays on the bar */}
                    <span class="text-gray-800">{label}</span>
                </div>
            )}

            {/* The percentage always at the end of the bar, on the right */}
            <div class="absolute top-0 right-4 h-full flex items-center text-gray-800">
                <span class="text-sm">{percentage}%</span>
            </div>
        </div>
    );
});
