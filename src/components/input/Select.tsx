import { component$, type QRL, useSignal } from '@builder.io/qwik';
import clsx from 'clsx';
import { InputError } from './InputError';
import { LuChevronDown } from '@qwikest/icons/lucide';
import { Select as SelectFlowbite } from 'flowbite-qwik'

type SelectProps = {
    ref: QRL<(element: HTMLSelectElement) => void>;
    name: string;
    value: string | string[] | null | undefined;
    onInput$: (event: Event, element: HTMLSelectElement) => void;
    onChange$: (event: Event, element: HTMLSelectElement) => void;
    onBlur$: (event: Event, element: HTMLSelectElement) => void;
    options: { name: string; value: string }[];
    multiple?: boolean;
    size?: number;
    placeholder?: string;
    required?: boolean;
    class?: string;
    label?: string;
    error?: string;
};

/**
 * Select field that allows users to select predefined values. Various
 * decorations can be displayed in or around the field to communicate the
 * entry requirements.
 */
export const Select = component$(
    (props: SelectProps) => {
        const { name, multiple } = props;

        const selected = useSignal('')

        return (
            <div class={clsx('', props.class)}>
                <div class="relative flex items-center">
                    <SelectFlowbite
                        bind:value={selected}
                        label={props.label}
                        options={props.options}
                        underline
                    />
                    {!multiple && (
                        <span class="pointer-events-none absolute right-6 h-5 lg:right-8 lg:h-6">
                            <LuChevronDown />
                        </span>
                    )}
                </div>
                <InputError name={name} error={props.error} />
            </div>
        );
    }
);
