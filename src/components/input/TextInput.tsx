import { component$, useSignal, useTask$, type QRL } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { Input } from 'flowbite-qwik';
import { capitalizeFirst } from '~/utils';

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
        const { name } = props;
        const input = useSignal(value);
        useTask$(({ track }) => {
            if (!Number.isNaN(track(() => value))) {
                input.value = value;
            }
        });
        return (
            <div class={clsx('', props.class)}>
                <Input
                    {...props}
                    label={capitalizeFirst(label ?? '')}
                    // validationStatus={error ? 'error' : undefined}
                    aria-invalid={!!error}
                    aria-errormessage={`${name}-error`}
                />
                <InputError name={name} error={error} />
            </div>
        );
    }
);
