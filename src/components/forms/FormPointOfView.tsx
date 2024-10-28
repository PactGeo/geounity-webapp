import { routeLoader$ } from '@builder.io/qwik-city';
import { Textarea } from '~/components/ui';
import { formAction$, SubmitHandler, useForm, valiForm$, type InitialValues } from '@modular-forms/qwik';
import * as v from 'valibot'
import { FormFooter } from "./FormFooter";
import { _ } from "compiled-i18n";
import { $, component$ } from '@builder.io/qwik';
import { Select } from "~/components/input/Select";
import { CommunityType } from '~/constants';
import {dataArray as countries} from "~/data/countries";

const PointOfViewSchema = v.object({
    debateId: v.string(),
    country: v.string(),
    opinion: v.pipe(
        v.string(),
        v.nonEmpty(`_Please enter your opinion`),
        v.minLength(3, 'Your opinion must have 3 characters or more.'),
        v.maxLength(100, 'Your opinion must have 100 characters or less.'),
    ),
});

type PointOfViewForm = v.InferInput<typeof PointOfViewSchema>;

export const useFormLoader = routeLoader$<InitialValues<PointOfViewForm>>(({ pathname }) => {
    return {
        debateId: '',
        country: '',
        opinion: '',
    };
});

type ResponseData = {
    debateId: string;
    country: string;
    opinion: string;
};

export const useFormAction = formAction$<PointOfViewForm, ResponseData>(
    async (values, event) => {
        console.log('=== useFormAction PointOfViewForm ===')
        console.log('values', values)
        const API_BASE_URL = 'http://localhost:8000'
        const session = event.sharedMap.get('session')
        const token = session?.accessToken
        console.log('token', token)

        const payload = {
            country: values.country,
            content: values.opinion,
        }
        console.log('payload', payload)

        const response = await fetch(`${API_BASE_URL}/debates/${values.debateId}/opinion`, {
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
            message: _`Point of view created successfully`,
            data: data
        }
        // Runs on server
    },
    valiForm$(PointOfViewSchema)
);

interface FormPointOfViewProps {
    debateId: string;
    onSubmitCompleted?: () => void;
}

export default component$<FormPointOfViewProps>(({debateId}) => {
    console.log('debateId', debateId)
    const [pollForm, { Form, Field }] = useForm<PointOfViewForm, ResponseData>({
        loader: useFormLoader(),
        action: useFormAction(),
        validate: valiForm$(PointOfViewSchema),
    });

    const handleSubmit = $<SubmitHandler<PointOfViewForm>>((values, event) => {
        console.log('== handleSubmit ==')
        console.log('event', event)
        console.log('values', values)
        // Runs on client
    });
    
    const countriesOptions = countries.map(c => ({ value: c.name, label: `${c.flag} ${c.name}` }))

    return (
        <Form
            onSubmit$={handleSubmit}
            class="space-y-4 md:space-y-6 lg:space-y-8"
        >
            <div class="space-y-4 md:space-y-6 lg:space-y-8">
                <Field name="debateId">
                    {(field, props) => (
                        <input
                            {...props}
                            value={field.value}
                        />
                    )}
                </Field>
                <Field name="country">
                    {(field, props) => field.value != CommunityType.GLOBAL && (
                        <Select
                            {...props}
                            label={_`Country`}
                            options={countriesOptions}
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
                <Field name="opinion">
                    {(field, props) => (
                        <Textarea
                            {...props}
                            value={field.value}
                            error={field.error}
                            placeholder={_`Enter a opinion`}
                        />
                    )}
                </Field>
            </div>
            <FormFooter of={pollForm} />
        </Form>
    )
});
