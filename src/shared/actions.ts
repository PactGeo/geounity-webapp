import { formAction$, valiForm$ } from "@modular-forms/qwik";
import { _ } from "compiled-i18n";
import type { CountryForm, PollForm } from "~/schemas";
import { CountrySchema, PollSchema } from "~/schemas";

export type PollResponseData = {
    type: string;
    title: string;
    description: string;
    options: string[];
    community: string;
    endDate: string;
    status: string;
    community_ids: number[];
};
export const useFormPollAction = formAction$<PollForm, PollResponseData>(
    async (values, event) => {
        console.log('############ useFormPollAction ############')
        console.log('values', values)
        const session = event.sharedMap.get('session')
        const token = session?.accessToken
        console.log('token', token)

        const payload = {
            title: values.title,
            description: values.description,
            poll_type: values.type,
            is_anonymous: values.is_anonymous,
            ends_at: values.endDate.active && values.endDate.value !== '' ? values.endDate.value : null,
            community_ids: values.community_ids,
            community_type: values.community_type,
            options: values.options,
            status: 'ACTIVE',
            tags: values.tags,
        }
        console.log('payload', payload)

        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/polls`, {
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

export const useFormCountryAction = formAction$<CountryForm>(
    async (values, event) => {
        console.log('useFormCountryAction')
        console.log('values', values)
        console.log('event', event)
        return {
            success: true,
            message: _`Point of view created successfully`,
        }
        // Runs on server
    },
    valiForm$(CountrySchema)
);