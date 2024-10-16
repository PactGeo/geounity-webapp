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
            <div class={clsx('', props.class)}>
                <InputLabel name={name} label={label} required={required} />
                <input
                    {...props}
                    class={clsx(
                        'h-14 w-full rounded-2xl border-2 bg-white px-5 outline-none placeholder:text-slate-500 dark:bg-gray-900 md:h-16 md:text-lg lg:h-[70px] lg:px-6 lg:text-xl',
                        error
                            ? 'border-red-600/50 dark:border-red-400/50'
                            : 'border-slate-200 hover:border-slate-300 focus:border-sky-600/50 dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-sky-400/50'
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