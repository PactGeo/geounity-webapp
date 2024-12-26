import { type ActionStore } from '@builder.io/qwik-city';
import { type FormStore, reset } from '@modular-forms/qwik';
import { ActionButton } from './ActionButton';
import { _ } from 'compiled-i18n';

type FormFooterProps = {
    of: FormStore<any, any>;
    resetAction?: ActionStore<object, Record<string, any>, true>;
    form?: string;
};

export function FormFooter({
    of: formStore,
    resetAction,
    form,
}: FormFooterProps) {
    return (
        <footer class="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
            {/* Botón de Submit */}
            <ActionButton
                class="w-full md:w-auto"
                variant="primary"
                label={_`Submit`}
                type="submit"
                form={form}
            />

            {/* Botón de Reset */}
            {resetAction && (
                <ActionButton
                    class="w-full md:w-auto"
                    variant="secondary"
                    label={_`Reset`}
                    type="button"
                    preventdefault:click
                    onClick$={() => reset(formStore)}
                />
            )}
        </footer>
    );
}
