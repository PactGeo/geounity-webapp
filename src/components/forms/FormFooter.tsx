import { type ActionStore, Form } from '@builder.io/qwik-city';
import { type FormStore, reset } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';
import { _ } from 'compiled-i18n';

type FormFooterProps = {
    of: FormStore<any, any>;
    resetAction?: ActionStore<{}, Record<string, any>, true>;
    form?: string;
};

/**
 * Form footer with buttons to reset and submit the form.
 */
export function FormFooter({
    of: formStore,
    resetAction,
    form,
}: FormFooterProps) {
    return (
        <footer class="flex justify-center space-x-4 mt-6">
            <ActionButton
                class="w-full px-8 py-2"
                variant="primary"
                label={_`Submit`}
                type="submit"
                form={form}
            />
            {resetAction && (
                <ActionButton
                    class="w-auto px-8 py-2"
                    variant="secondary"
                    label={_`Reset`}
                    type={resetAction ? 'submit' : 'button'}
                    preventdefault:click
                    onClick$={() => reset(formStore)}
                />
            )}
        </footer>
    );
}
