import { $, component$, useStyles$ } from "@builder.io/qwik";
import { routeLoader$ } from '@builder.io/qwik-city';
import { Button, Textarea } from '~/components/ui';
import { LuMinus, LuPlus } from "@qwikest/icons/lucide";
import { formAction$, insert, remove, SubmitHandler, useForm, valiForm$, type InitialValues } from '@modular-forms/qwik';
import * as v from 'valibot'
import { TextInput } from "~/components/input/TextInput";
import { ChipGroup } from "~/components/input/ChipGroup";
import { FormHeader } from "./FormHeader";
import { FormFooter } from "./FormFooter";
import styles from "./form.css?inline";
import { _ } from "compiled-i18n";

// As TypeScript enum
enum PollType {
    Binary = 'BINARY',
    SingleChoice = 'SINGLE_CHOICE',
    MultipleChoice = 'MULTIPLE_CHOICE',
}

const PollSchema = v.object({
    type: v.enum(PollType),
    title: v.pipe(
        v.string(),
        v.nonEmpty('Please enter a title.'),
        v.minLength(5, 'Your password must have 5 characters or more.'),
        v.maxLength(100, 'Your password must have 100 characters or less.'),
    ),
    description: v.pipe(
        v.string(),
        v.maxLength(5000, 'Your password must have 5000 characters or less.'),
    ),
    options: v.pipe(
        v.array(
            v.pipe(v.string(), v.nonEmpty('Please enter a name for the option.'))
        ),
        v.minLength(2, 'You must have at least 2 options.'),
        v.maxLength(10, 'You must have at most 10 options.'),
    ),
    community: v.string(),
    endDate: v.string(),
});

type PollForm = v.InferInput<typeof PollSchema>;

export const useFormLoader = routeLoader$<InitialValues<PollForm>>(({ pathname }) => {
    return {
        type: PollType.SingleChoice,
        title: '',
        description: '',
        options: ['', ''],
        community: pathname.includes('/global/') ? 'Global' : 'private',
        endDate: '',
    };
});

type ResponseData = {
    type: string;
    title: string;
    description: string;
    options: string[];
    community: string;
    endDate: string;
    status: string;
};

export const useFormAction = formAction$<PollForm, ResponseData>(
    async (values, event) => {
        console.log('=== useFormAction ===')
        console.log('values', values)
        const API_BASE_URL = 'http://localhost:8000'
        const session = event.sharedMap.get('session')
        const token = session?.accessToken
        console.log('token', token)

        const payload = {
            title: values.title,
            description: values.description,
            poll_type: values.type,
            is_anonymous: false,
            ends_at: values.endDate,
            community_id: values.community === 'Global' ? 1 : 2,
            options: values.options,
            status: 'ACTIVE',
        }
        console.log('payload', payload)

        const response = await fetch(`${API_BASE_URL}/polls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return {
            success: true,
            message: _`Poll created successfully`,
            data: data
        }
        // Runs on server
    },
    valiForm$(PollSchema)
);

interface FormPollProps {
    onSubmitCompleted?: () => void;
}

export default component$<FormPollProps>(() => {
    useStyles$(styles);

    const [pollForm, { Form, Field, FieldArray }] = useForm<PollForm, ResponseData>({
        loader: useFormLoader(),
        action: useFormAction(),
        fieldArrays: ['options'],
        validate: valiForm$(PollSchema),
    });

    const handleSubmit = $<SubmitHandler<PollForm>>((values, event) => {
        console.log('== handleSubmit ==')
        console.log('event', event)
        console.log('values', values)
        // Runs on client
    });

    return (
        <Form
            onSubmit$={handleSubmit}
            class="space-y-4 md:space-y-6 lg:space-y-8"
        >
            <FormHeader of={pollForm} />
            <div class="space-y-4 md:space-y-6 lg:space-y-8">
                <Field name="title">
                    {(field, props) => (
                        <TextInput
                            {...props}
                            type="text"
                            label={field.name}
                            value={field.value}
                            error={field.error}
                            placeholder={_`Enter a title`}
                            required
                        />
                    )}
                </Field>
                <Field name="description">
                    {(field, props) => (
                        <Textarea
                            {...props}
                            value={field.value}
                            error={field.error}
                            placeholder="Enter a description"
                        />
                    )}
                </Field>

                <Field name="type">
                    {(field, props) => (
                        <ChipGroup
                            {...props}
                            name="type"
                            value={field.value || PollType.SingleChoice}
                            options={[
                                { value: PollType.Binary, label: 'Binary', description: 'A binary poll has only two options, such as Yes or No.' },
                                { value: PollType.SingleChoice, label: 'Single Choice', description: 'A single choice poll allows participants to select only one option.' },
                                { value: PollType.MultipleChoice, label: 'Multiple Choice', description: 'A multiple choice poll allows participants to select multiple options.' },
                            ]}
                            label="Type"
                            required
                            error={field.error}
                            class="mt-1 h-4 w-4 cursor-pointer lg:mt-1 lg:h-5 lg:w-5"
                        />
                    )}
                </Field>
                {/* Campo de Opciones con FieldArray */}
                <FieldArray name="options">
                    {(fieldArray) => (
                        <div class="space-y-2">
                            {fieldArray.items.map((option, index) => (
                                <div key={option} class="flex items-center space-x-2">
                                    <Field name={`options.${index}`}>
                                        {(field, props) => (
                                            <TextInput
                                                {...props}
                                                type="text"
                                                label={`Opción ${index + 1}`}
                                                value={field.value}
                                                error={field.error}
                                                placeholder={`Opción ${index + 1}`}
                                                required
                                            />
                                        )}
                                    </Field>
                                    {fieldArray.items.length > 2 && (
                                        <Button
                                            type="button"
                                            onClick$={() => remove(pollForm, 'options', { at:index})}
                                            // look="danger"
                                            aria-label={`Eliminar Opción ${index + 1}`}
                                        >
                                            <LuMinus />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            {fieldArray.items.length < 10 && pollForm.internal.fields.type?.value !== PollType.Binary && (
                                <Button
                                    type="button"
                                    onClick$={() => insert(pollForm, 'options', { value: '' })}
                                    look="ghost"
                                    size="sm"
                                >
                                    <LuPlus class="mr-2" />
                                    
                                    {_`Add option`}
                                </Button>
                            )}
                            {fieldArray.error && <div class="text-red-500">{fieldArray.error}</div>}
                        </div>
                    )}
                </FieldArray>
                <Field name="community">
                    {(field, props) => (
                        <TextInput
                            {...props}
                            type="text"
                            label={field.name}
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
                <Field name="endDate">
                    {(field, props) => (
                        <TextInput
                            {...props}
                            type="date"
                            label={field.name}
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
            </div>
            <FormFooter of={pollForm} />
        </Form>
    )
});
