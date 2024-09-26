import { $, component$, type PropsOf } from '@builder.io/qwik';
import { cn } from '@qwik-ui/utils';

type InputProps = PropsOf<'input'> & {
  error?: string;
};

export const Input = component$<InputProps>(
  ({ name, error, id, ['bind:value']: valueSig, value, onInput$, ...props }) => {
    const inputId = id || name;

    return (
      <>
        <div class="relative">
          <input
            {...props}
            aria-errormessage={`${inputId}-error`}
            aria-invalid={!!error}
            // workaround to support two way data-binding on the Input component (https://github.com/QwikDev/qwik/issues/3926)
            value={valueSig ? valueSig.value : value}
            onInput$={valueSig ? $((__, el) => (valueSig.value = el.value)) : onInput$}
            class={cn(
              'flex h-12 w-full rounded-base border px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-red-500 focus-visible:ring-red-500' : 'border-input focus-visible:ring-ring',
              props.class,
            )}
            id={inputId}
            name={name}
          />
          {props.maxLength && (
            <span class="absolute right-3 bottom-1 text-xs text-muted-foreground">
              {valueSig?.value?.length}/{props.maxLength}
            </span>
          )}
        </div>
        {error && (
          <div id={`${inputId}-error`} class="text-red-500 mt-1 text-sm">
            {error}
          </div>
        )}
      </>
    );
  },
);
