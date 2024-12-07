import { component$, useSignal, type PropsOf } from '@builder.io/qwik';
import { Textarea as TextareaFlowBite } from 'flowbite-qwik'
import { capitalizeFirst } from '~/utils';

type TextareaProps = PropsOf<'textarea'> & {
  error?: string;
  id?: string;
  label?: string;
  placeholder?: string;
};

export const Textarea = component$<TextareaProps>(
  (props) => {
    const textareaValue = useSignal('');
    return (
      <TextareaFlowBite
        {...props}
        label={capitalizeFirst(props.label ?? '')}
        bind:value={textareaValue}
      />
    );
  },
);
