import { $, component$, useSignal, noSerialize, type PropFunction } from '@builder.io/qwik';
import type { NoSerialize } from '@builder.io/qwik';
import { LuPencil, LuTrash, LuCamera } from '@qwikest/icons/lucide';
import { Label } from '~/components/ui';

type FileInputProps = {
    name: string;
    id?: string;
    accept?: string;
    bind?: {
        value: PropFunction<string | NoSerialize<File> | null | undefined>;
    };
    label?: string;
    error?: string;
};

export const FileInput = component$<FileInputProps>(({ name, id, accept = "image/*,video/*", bind, label, error }) => {
    const inputId = id || name;
    const previewUrl = useSignal<string | null>(null);

    const handleFileChange = $((event: Event) => {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const selectedFile = input.files[0];
            if (bind?.value) {
                // @ts-ignore
                bind.value = noSerialize(selectedFile);  // Usamos noSerialize aquí
            }
            previewUrl.value = URL.createObjectURL(selectedFile);
        }
    });

    const handleClearFile = $(() => {
        if (bind?.value) {
            // @ts-ignore
            bind.value = null;
        }
        previewUrl.value = null;
    });

    return (
        <div class="grid w-full max-w-sm items-center gap-1.5">
            {label && <Label for={inputId} class="text-sm font-medium text-gray-700">{label}</Label>}
            <div class="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg bg-gray-50 border-gray-300">
                {previewUrl.value ? (
                    <div class="relative w-full h-full">
                        <img src={previewUrl.value} alt="Preview" class="object-cover w-full h-full rounded-lg" />
                        <div class="absolute bottom-0 right-0 flex space-x-2 p-2 bg-opacity-60">
                            <label for={inputId} class="cursor-pointer text-blue-500">
                                <LuPencil class="h-5 w-5" />
                            </label>
                            <button type="button" class="text-red-500" onClick$={handleClearFile}>
                                <LuTrash class="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <label for={inputId} class="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <LuCamera />
                        <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Arrastra y suelta el archivo o haz clic</span></p>
                    </label>
                )}
                <input
                    id={inputId}
                    name={name}
                    type="file"
                    accept={accept}
                    onChange$={handleFileChange}
                    class="hidden"
                />
            </div>
            {error && (
                <div id={`${inputId}-error`} class="text-destructive mt-1 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
});
