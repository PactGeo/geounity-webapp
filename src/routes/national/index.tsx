import { $, component$ } from "@builder.io/qwik";
import { routeLoader$, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { useGetTags } from "~/shared/loaders";
import ListTags from "~/components/list/ListTags";
import NavResources from "~/components/navs/NavResources";
import { Field, Form, formAction$, InitialValues, SubmitHandler, useForm, valiForm$ } from "@modular-forms/qwik";
import { CommunityType } from "~/constants";
import { Select } from "~/components/input/Select";
import { FormFooter } from "~/components/forms/FormFooter";
import * as v from 'valibot'
import { _ } from "compiled-i18n";
import {dataArray as countries} from "~/data/countries";

export { useGetTags } from '~/shared/loaders';

const CountrySchema = v.object({
    country: v.string(),
});

type CountryForm = v.InferInput<typeof CountrySchema>;

export const useFormLoader = routeLoader$<InitialValues<CountryForm>>(({ pathname }) => {
    return {
        country: '',
    };
});

export const useFormAction = formAction$<CountryForm>(
    async (values, event) => {
        return {
            success: true,
            message: _`Point of view created successfully`,
        }
        // Runs on server
    },
    valiForm$(CountrySchema)
);

export default component$(() => {
    const tags = useGetTags();
    const nav = useNavigate();
    const [countryForm, { Form, Field }] = useForm<CountryForm>({
        loader: useFormLoader(),
        action: useFormAction(),
        validate: valiForm$(CountrySchema),
    });
    const handleSubmit = $<SubmitHandler<CountryForm>>((values, event) => {
        return nav(`/national/${values.country}`)
        // Runs on client
    });
    const countriesOptions = countries.map(c => ({ value: c.name, label: `${c.flag} ${c.name}` }))
    return (
        <div>
            <h1>Overview</h1>
            <Form
                onSubmit$={handleSubmit}
                class="space-y-4 md:space-y-6 lg:space-y-8"
            >
                <Field name="country">
                    {(field, props) => (
                        <Select
                            {...props}
                            label={_`Country`}
                            options={countriesOptions}
                            value={field.value}
                            error={field.error}
                        />
                    )}
                </Field>
                <FormFooter of={countryForm} />
            </Form>
        </div>
    )
});

export const head: DocumentHead = {
    title: "Global Discussions",
    meta: [
        {
            name: "description",
            content: "Global Discussions description",
        },
    ],
};