import { $, component$, useSignal, type QRL } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';
import { capitalizeFirst } from '~/utils';

type InputListProps = {
    name: string;
    label?: string;
    placeholder?: string;
    error: string;
    required?: boolean;
    class?: string;
    tags: { id: string; name: string }[];
    ref: QRL<(element: HTMLInputElement) => void>;
    onInput$: (event: Event, element: HTMLInputElement) => void;
    onChange$: (event: Event, element: HTMLInputElement) => void;
    onBlur$: (event: Event, element: HTMLInputElement) => void;
};

export const InputList = component$(
    ({ label, error, tags, ...props }: InputListProps) => {
        const selectedTags = useSignal<string[]>([]);
        const inputValue = useSignal<string>('');

        const addTag = $(() => {
            const newTag = inputValue.value.trim();
            if (newTag !== '' && !selectedTags.value.includes(newTag)) {
                const newTags = [...selectedTags.value, newTag];
                selectedTags.value = newTags;
                inputValue.value = '';
            }
        });

        const removeTag = $((tagToRemove: string) => {
            selectedTags.value = selectedTags.value.filter(t => t !== tagToRemove);
        });

        return (
            <div>
                {label && (
                    <label class="block text-sm font-medium text-gray-700" for={props.name}>
                        {capitalizeFirst(label)}
                    </label>
                )}

                {/* Tags seleccionados */}
                <div class="flex items-center gap-2 flex-wrap">
                    {selectedTags.value.map((tag) => (
                        <span
                            key={tag}
                            class="flex items-center bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium"
                        >
                            {tag}
                            <button
                                type="button"
                                class="ml-2 text-blue-700 hover:text-blue-900"
                                onClick$={() => removeTag(tag)}
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                </div>

                {/* Input para añadir tags */}
                <div class="relative">
                    <input
                        {...props}
                        type="text"
                        // @ts-ignore
                        list={`${props.name}-list`}
                        value={inputValue.value}
                        onInput$={(e) => (inputValue.value = (e.target as HTMLInputElement).value)}
                        onKeyDown$={(e) => {
                            if (e.key === 'Enter' && inputValue.value.trim()) {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                        placeholder={_`Add a tag and press Enter`}
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <datalist id={`${props.name}-list`}>
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.name} />
                        ))}
                    </datalist>
                </div>

                {/* Mensaje de error */}
                {error && <div class="text-red-500 text-sm mt-1">{error}</div>}
            </div>
        );
    }
);
