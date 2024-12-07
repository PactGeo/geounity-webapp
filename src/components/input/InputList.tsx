import { $, component$, useSignal, useTask$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { Badge } from 'flowbite-qwik';
import { capitalizeFirst } from '~/utils';
import { Field } from '@modular-forms/qwik';

type InputListProps = {
    name: string;
    label?: string;
    placeholder?: string;
    value: string[] | undefined;
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
    ({ label, value = [], error, tags, ...props }: InputListProps) => {
        const { name } = props;
        const selectedTags = useSignal<string[]>(value);
        const inputValue = useSignal<string>('');

        useTask$(({ track }) => {
            track(() => value);
            if (value) selectedTags.value = value;
        });

        const addTag = $((newTag: string) => {
            if (newTag && !selectedTags.value.includes(newTag)) {
                selectedTags.value = [...selectedTags.value, newTag];
            }
        });

        const removeTag = $((tag: string) => {
            selectedTags.value = selectedTags.value.filter(t => t !== tag);
        });

        const handleInput = $((inputText: string) => {
            const trimmedText = inputText.trim();
            if (trimmedText && !selectedTags.value.includes(trimmedText)) {
                addTag(trimmedText);
                inputValue.value = '';
            }
        });

        return (
            <div>
                {label && (
                    <label class="block text-sm font-medium text-gray-700" for={name}>
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
                        list={`${name}-list`}
                        type="text"
                        value={inputValue.value}
                        onInput$={(e) => (inputValue.value = (e.target as HTMLInputElement).value)}
                        onKeyDown$={(e) => {
                            if (e.key === 'Enter' && inputValue.value.trim()) {
                                e.preventDefault();
                                handleInput(inputValue.value);
                            }
                        }}
                        placeholder="Add a tag and press Enter"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <datalist id={`${name}-list`}>
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
