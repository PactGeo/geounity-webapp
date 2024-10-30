import { type ActionStore, Form } from '@builder.io/qwik-city';
import { type FormStore, reset } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';

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
        <footer class="flex justify-end space-x-4 mt-6">
            <ActionButton
                variant="primary"
                label="Submit"
                type="submit"
                form={form}
            />
            {resetAction ? (
                <Form action={resetAction}>
                    <ActionButton
                        variant="secondary"
                        label="Reset"
                        type={resetAction ? 'submit' : 'button'}
                        preventdefault:click
                        onClick$={() => reset(formStore)}
                    />
                </Form>
            ) : (
                <ActionButton
                    variant="secondary"
                    label="Reset"
                    type={resetAction ? 'submit' : 'button'}
                    preventdefault:click
                    onClick$={() => reset(formStore)}
                />
            )}
        </footer>
    );
}
