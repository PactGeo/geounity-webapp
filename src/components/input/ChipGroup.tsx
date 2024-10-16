import { component$, QRL } from "@builder.io/qwik";
import clsx from "clsx";
import { InputError } from './InputError';
import { InputLabel } from './InputLabel';

type ChipGroupProps = {
    name: string;
    value?: string;
    options: { label: string; value: string, description?: string }[];
    onInput$?: QRL<(ev: Event, el: HTMLInputElement) => void>;
    label?: string;
    error?: string;
    required?: boolean;
    class?: string;
};

export const ChipGroup = component$((props: ChipGroupProps) => {
    const { name, value, options, label, error, required } = props;
    console.log('value', value)
    return (
        <div>
            <InputLabel name={name} label={label} required={required} />
            <div class="flex space-x-2">
                {options.map((option) => (
                    <label class="relative" key={option.value}>
                        <input
                            {...props}
                            type="radio"
                            id={props.name}
                            value={option.value || ''}
                            aria-invalid={!!props.error}
                            aria-errormessage={`${props.name}-error`}
                            class="hidden"
                        />
                        <span
                            class={clsx(
                                "px-4 py-2 rounded-full cursor-pointer",
                                value === option.value
                                    ? "bg-primary text-white"
                                    : "bg-muted text-foreground"
                            )}
                        >
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
            {/* Show description of the selected option */}
            {options.find(option => option.value === value)?.description && (
                <p class="mt-2 text-sm text-gray-500">
                    {options.find(option => option.value === value)?.description}
                </p>
            )}
            {error && <InputError name={name} error={error} />}
        </div>
    );
});
