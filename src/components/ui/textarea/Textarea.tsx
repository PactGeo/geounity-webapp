import { $, component$, type PropsOf } from '@builder.io/qwik';

type TextareaProps = PropsOf<'textarea'> & {
  error?: string;
};

export const Textarea = component$<TextareaProps>(
  ({ id, name, error, ['bind:value']: valueSig, value, onInput$, ...props }) => {
    const textareaId = id || name;
    return (
      <>
        <div class="relative space-y-1">
          <textarea
            {...props}
            // workaround to support two way data-binding on the Input component (https://github.com/QwikDev/qwik/issues/3926)
            value={valueSig ? valueSig.value : value}
            onInput$={valueSig ? $((__, el) => (valueSig.value = el.value)) : onInput$}
            // class={clsx(
            //   'focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:focus:border-blue-400',
            // )}
            class="min-h-[60px] w-full rounded-md border border-gray-300 px-4 py-2 outline-none placeholder:text-gray-400 shadow-sm focus:outline-blue-500 focus:border-none"
            id={textareaId}
            name={name}
          />
          {props.maxLength && (
            <span class="absolute right-3 bottom-1 text-xs text-gray-500">
              {valueSig?.value?.length}/{props.maxLength}
            </span>
          )}
          {error && <div id={`${textareaId}-error`} class="text-red-500 mt-1 text-sm">{error}</div>}
        </div>
      </>
    );
  },
);
