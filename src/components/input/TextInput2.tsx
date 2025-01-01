import { component$ } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { capitalizeFirst } from '~/utils';

type TextInputProps = {
    autofocus?: boolean;
    class?: string;
    error: string;
    hidden?: boolean;
    label: string;
    maxLength: number;
    name: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
};

export const TextInput2 = component$(
    ({ label, name, error, hidden, ...props }: TextInputProps) => {
        return (
            <div class={clsx(
                "w-full space-y-1 relative",
                error ? "text-red-500" : "focus-within:text-blue-500",
                hidden ? "hidden" : ""
            )}>
                <input
                    {...props}
                    aria-invalid={!!error}
                    aria-errormessage={`${name}-error`}
                    class={clsx(
                        'w-full bg-white dark:bg-black text-black dark:text-white',
                        'border-2 border-gray-300 focus:border-blue-500',
                        'rounded-sm pt-8 pb-2 px-3 focus:outline-none transition-colors duration-200',
                        error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500',
                        props.class
                    )}
                />
                {label && <div class="absolute top-2 left-3 text-sm pointer-events-none transition-colors duration-200">
                    {capitalizeFirst(label)}
                </div>}
                <div class="absolute top-2 right-3 text-sm text-gray-600 dark:text-gray-300">
                    {props.value?.length} / {props.maxLength}
                </div>
                <InputError name={name} error={error} />
            </div>
        );
    }
);
