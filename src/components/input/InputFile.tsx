import { $, component$, useSignal, useStore } from "@builder.io/qwik";
import { LuImage } from "@qwikest/icons/lucide";

interface InputFileProps {
    action: any;
}

export default component$<InputFileProps>(({ action }) => {
    const fileRef = useSignal<HTMLInputElement>();
    const previewUrl = useSignal<string | null>(null);

    const handleFileChange = $(() => {
        const file = fileRef.value?.files?.[0];
        if (file) {
            // Revoke the previous URL if it exists
            if (previewUrl.value) {
                URL.revokeObjectURL(previewUrl.value);
            }
            // Generate a new URL for the preview
            previewUrl.value = URL.createObjectURL(file);
        }
    });

    return (
        <div>
            <input
                accept="image/*"
                hidden
                ref={fileRef}
                type="file"
                id="file"
                name="image"
                onInput$={handleFileChange}
            />
            <button
                type="button"
                class="p-4 flex flex-col justify-center items-center space-y-3 border border-dashed rounded-lg"
                onClick$={() => fileRef.value?.click()}
            >
                {action.isRunning ? (
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-10 h-10 animate-spin"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                        </svg>
                    </div>
                ) : previewUrl.value ? (
                    <div class="my-4">
                        <img
                            class="w-40 h-40 aspect-square rounded-lg"
                            src={previewUrl.value}
                            alt="Preview"
                        />
                    </div>
                ) : (
                    <>
                        <div>
                            <span class="text-3xl">
                                <LuImage />
                            </span>
                        </div>
                        <span>Choose image</span>
                    </>
                )
            }
            </button>
            {action.value?.secureUrl && (
                <div class="my-4">
                    <img
                        class="w-40 h-40 aspect-square rounded-lg"
                        src={action.value.secureUrl}
                        alt="Preview"
                    />
                </div>
            )}
        </div>
    )
})