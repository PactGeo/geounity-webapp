import { formAction$, valiForm$ } from "@modular-forms/qwik";
import { PollForm, PollSchema } from "~/schemas";

export type PollResponseData = {
    type: string;
    title: string;
    description: string;
    options: string[];
    community: string;
    endDate: string;
    status: string;
};
export const useFormAction = formAction$<PollForm, PollResponseData>(
    async (values, event) => {
        console.log('=== POLL useFormAction ===')
        console.log('values', values)
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

        const response = await fetch(`http://localhost:8000/polls`, {
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
