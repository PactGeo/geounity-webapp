import { component$, useSignal, useTask$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputLabel } from './InputLabel';
import { InputError } from './InputError';

type TextInputProps = {
    name: string;
    type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date';
    label?: string;
    placeholder?: string;
    value: string | undefined;
    error: string;
    required?: boolean;
    class?: string;
    ref: QRL<(element: HTMLInputElement) => void>;
    onInput$: (event: Event, element: HTMLInputElement) => void;
    onChange$: (event: Event, element: HTMLInputElement) => void;
    onBlur$: (event: Event, element: HTMLInputElement) => void;
};

export const TextInput = component$(
    ({ label, value, error, ...props }: TextInputProps) => {
        const { name, required } = props;
        const input = useSignal(value);
        useTask$(({ track }) => {
            if (!Number.isNaN(track(() => value))) {
                input.value = value;
            }
        });
        return (
            <div class={clsx('space-y-1', props.class)}>
                <InputLabel name={name} label={label} required={required} />
                <input
                    {...props}
                    class={clsx(
                        'w-full h-12 rounded-md border border-gray-300 bg-white px-4 py-2 outline-none placeholder:text-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900  dark:focus:border-blue-400',
                        error
                            ? 'border-red-600 dark:border-red-400'
                            : 'hover:border-gray-400 dark:border-gray-800'
                    )}
                    id={name}
                    value={input.value}
                    aria-invalid={!!error}
                    aria-errormessage={`${name}-error`}
                />
                <InputError name={name} error={error} />
            </div>
        );
    }
);
