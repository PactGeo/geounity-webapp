import { $, component$, useSignal } from '@builder.io/qwik';
import { _ } from 'compiled-i18n';
import { InputLabel } from './InputLabel';
import { getValue, setValue } from '@modular-forms/qwik';

interface TagInputProps {
    error?: string;
    form: any;
    name: string;
    label?: string;
    predefinedTags: { id: string; name: string }[];
}

export const TagInput = component$<TagInputProps>((props) => {
    const inputValue = useSignal('');

    const value = getValue(props.form, props.name) as string[];
    console.log('value getValue', value)

    const addTag = $((tag: string) => {
        const currentValue = getValue(props.form, props.name) || [];
        if (tag && Array.isArray(currentValue) && currentValue.every((t) => typeof t === 'string') && !currentValue.includes(tag)) {
            setValue(props.form, props.name, Array.isArray(currentValue) ? [...currentValue, tag] : [tag]);
            inputValue.value = '';
        }
    });

    const removeTag = $((tag: string) => {
        if (Array.isArray(value)) {
            setValue(props.form, props.name, (value as string[]).filter((t: string) => t !== tag));
        }
    });

    const handleKeyDown = $((event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTag(inputValue.value.trim());
        }
    });

    return (
        <div>
            {props.label && <InputLabel name={props.name} label={props.label} />}
            
            {/* Tags seleccionadas */}
            <div class="flex items-center gap-2 flex-wrap mb-2">
                {Array.isArray(value) && value.map((tag) => (
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

            {/* Input para agregar tags */}
            <div class="relative">
                <input
                    type="text"
                    // @ts-ignore
                    list={`${props.name}-list`}
                    value={inputValue.value}
                    onInput$={(e) => (inputValue.value = (e.target as HTMLInputElement).value)}
                    onKeyDown$={handleKeyDown}
                    placeholder={_`Add a tag and press Enter`}
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <datalist id={`${props.name}-list`}>
                    {props.predefinedTags.map((tag) => (
                        <option key={tag.id} value={tag.name} />
                    ))}
                </datalist>
            </div>

            {/* Mensaje de error */}
            {props.error && <div class="text-red-500 text-sm mt-1">{props.error}</div>}
        </div>
    );
});
