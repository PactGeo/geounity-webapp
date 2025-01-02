import { routeAction$ } from "@builder.io/qwik-city";
import { formAction$, valiForm$ } from "@modular-forms/qwik";
import { _ } from "compiled-i18n";
import { DebateStatus } from "~/constants";
import type { CountryForm, PollForm, UserForm } from "~/schemas";
import { CountrySchema, PollSchema, UserSchema } from "~/schemas";
import { type DiscussionForm, DiscussionSchema } from "~/schemas/discussionSchema";
import { type ReportForm, ReportSchema } from "~/schemas/reportSchema";

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
            ends_at: values.endDate !== '' ? values.endDate : null,
            community_ids: values.community_ids,
            scope: values.scope,
            options: values.options,
            status: 'ACTIVE',
            tags: values.tags,
        }
        

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

export type DebateResponseData = {
    title: string;
    description: string;
    status: string;
    type: string;
}

export const useFormDiscussionAction = formAction$<DiscussionForm, DebateResponseData>(
    async (values, event) => {
        console.log('***************** useFormDiscussionAction **********************')
        console.log('values', values)
        const session = event.sharedMap.get('session');
        const token = session?.accessToken;
        
        const payload = {
            title: values.title,
            description: values.description,
            status: DebateStatus.OPEN,
            type: values.scope,
            tags: values.tags,
        }
        console.log('payload', payload)
        
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/debates`, {
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
            message: _`Debate created successfully`,
            data,
        }
    },
    valiForm$(DiscussionSchema)
);

export type UserResponseData = {
    title: string;
    description: string;
    status: string;
    type: string;
}

export const useUserFormAction = formAction$<UserForm, UserResponseData>(
    async (values, event) => {
        console.log('useUserFormAction')
        console.log('values', values)
        const session = event.sharedMap.get('session')
        const token = session?.accessToken

        const payload = {
            username: values.username,
            name: values.name,
            bio: values.bio,
            location: values.location,
            website: values.website,
            // banner: values.banner,
            // image: values.image,
        }

        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/users/me`, {
            method: 'PATCH',
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
    valiForm$(UserSchema)
);

export type ReportResponseData = {
    title: string;
    description: string;
    status: string;
    type: string;
}

export const useFormReportAction = formAction$<ReportForm, ReportResponseData>(
    async (values, event) => {
        console.log('===== useFormReportAction =====')
        console.log('values', values)
        const token = event.sharedMap.get("session")?.accessToken;
        console.log('token', token)

        const payload = {
            content_type: values.content_type,
            content_id: values.content_id,
            reason: values.reason,
            description: values.description,
        }

        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/reports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            return {
                success: false,
                message: "Failed to submit the report",
            };
        }

        const data = await response.json();

        return {
            success: true,
            message: _`Report submitted successfully`,
            data
        };
    },

    valiForm$(ReportSchema)
);

export const useRemovePollAction = routeAction$(async ({ pollId }, event) => {
    const session = event.sharedMap.get('session')
    const token = session?.accessToken
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/polls/${pollId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return {
        success: true,
        message: _`Poll removed successfully`,
        data: data
    }
})

export interface SharePollResponseData {
    success: boolean; // Indica si la operación fue exitosa
    message: string; // Mensaje de respuesta (ej. "Poll shared successfully")
    data?: {
        poll_id: string; // ID de la encuesta compartida
        share_link: string; // Link generado para compartir
        timestamp?: string; // Opcional: Hora/fecha en que se compartió
    };
}
