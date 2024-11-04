import { type ActionStore, Form } from '@builder.io/qwik-city';
import { reset, type FormStore } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';

type FormHeaderProps = {
    of: FormStore<any, any>;
    heading?: string;
    resetAction?: ActionStore<object, Record<string, any>, true>;
    form?: string;
};

/**
 * Form header with heading and buttons to reset and submit the form.
 */
export function FormHeader({
    of: formStore,
    heading,
    resetAction,
    form,
}: FormHeaderProps) {
    return (
        <header class="flex items-center justify-between px-8 lg:px-10">
            <h1 class="text-2xl text-slate-900 dark:text-slate-200 md:text-3xl lg:text-4xl">
                {heading}
            </h1>
            <div class="hidden lg:flex lg:space-x-8">
                {resetAction ? (
                    <Form action={resetAction}>
                        <ActionButton
                            variant="secondary"
                            label="Reset"
                            type="button"
                            preventdefault:click
                            onClick$={() => reset(formStore)}
                        />
                    </Form>
                ) : (
                    <ActionButton
                        variant="secondary"
                        label="Reset"
                        type="button"
                        preventdefault:click
                        onClick$={() => reset(formStore)}
                    />
                )}
                <ActionButton
                    variant="primary"
                    label="Submit"
                    type="submit"
                    form={form}
                />
            </div>
        </header>
    );
}
