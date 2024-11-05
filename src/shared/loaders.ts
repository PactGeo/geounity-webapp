import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";
import type { InitialValues } from "@modular-forms/qwik";
import { PollType } from "~/constants";
import type { UserType } from "~/contexts/UserContext";
import type { CountryForm, PollForm } from "~/schemas";

export const useServerTimeLoader = routeLoader$(() => {
    return {
        date: new Date().toISOString(),
    };
});

export const useUser = routeLoader$(async ({ sharedMap }) => {
    const session = sharedMap.get('session');
    const token = session?.accessToken;
    if (!token) {
        return null;
    }
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/users/me`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data as UserType;
});

export const useGetTags = routeLoader$(async () => {
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/tags`, {
        headers: {
            Accept: 'application/json',
            Authorization: 'Basic c2ViYToxMjM0NTY='
        },
    });
    return (await response.json()) as Array<{
        id: string;
        name: string;
    }>;
});

export const useGetPolls = routeLoader$(async (requestEvent) => {
    const { sharedMap } = requestEvent;
    const pathname = requestEvent.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const communityType = segments[0];
    const session = sharedMap.get('session');
    const token = session?.accessToken;
    const tags = requestEvent.query.get('tags');
    const url = new URL(`${import.meta.env.PUBLIC_API_URL}/polls`);
    if (tags && tags !== 'all') {
        url.searchParams.append('tags', tags);
    }
    if (communityType) {
        url.searchParams.append('community_type', communityType);
    }
    const response = await fetch(url.toString(), {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch polls: ${response.statusText}`);
    }
    const data = await response.json();
    return data as Array<any>;
});

export const useGetDiscussions = routeLoader$(async (requestEvent) => {
    const { sharedMap } = requestEvent
    const session = sharedMap.get('session');
    const token = session?.accessToken;
    const tags = requestEvent.query.get('tags');
    const url = new URL(`${import.meta.env.PUBLIC_API_URL}/polls`);
    if (tags && tags !== 'all') {
        url.searchParams.append('tags', tags);
    }
    url.searchParams.append('community_id', '1');
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/debates/global`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch debates: ${response.statusText}`);
    }
    const data = await response.json();
    return data as Array<any>
});

export const useGetCountry = routeLoader$(async requestEvent => {
    const country = requestEvent.params.country;
    if (!country) {
        return null;
    }
    const session = requestEvent.sharedMap.get('session');
    const token = session?.accessToken;
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/countries/` + country, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data
})

export const useGetGlobalDebates = routeLoader$(async () => {
    const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/debates?debate_type=GLOBAL`, {
        headers: {
            Accept: 'application/json',
            Authorization: 'Basic c2ViYToxMjM0NTY='
        },
    });
    const debates = await response.json();
    return debates as Array<{
        id: string;
        type: string;
        title: string;
        slug: string;
        description: string;
        image_url: string;
        public: boolean;
        status: string;
        views_count: number;
        likes_count: number;
        dislikes_count: number;
        last_comment_at: string;
        language: string;
        creator_id: number;
        creator_username: string;
        created_at: string;
        updated_at: string;
    }>;
});

const uploadImage = async (file: Blob) => {
    const response_signature = await fetch(`${import.meta.env.PUBLIC_API_URL}/cloudinary/generate_signature`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Basic c2ViYToxMjM0NTY='
        },
    });
    const data_signature = await response_signature.json();
    const formdata = new FormData();
    formdata.append("signature", data_signature.signature);
    formdata.append("timestamp", data_signature.timestamp);
    formdata.append("api_key", data_signature.api_key);
    formdata.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    formdata.append("file", file);
    const endpoint = "https://api.cloudinary.com/v1_1/" + import.meta.env.VITE_CLOUDINARY_CLOUD_NAME + "/auto/upload";
    const res = await fetch(endpoint, {
        body: formdata,
        method: "post",
    });
    const data = await res.json();
    return {
        secureUrl: data.secure_url,
    };
}

export const usePostDebate = routeAction$(
    async (debate) => {
        if (debate.image) {
            const cloudinaryResponse = await uploadImage(debate.image);
            debate.image_url = cloudinaryResponse.secureUrl;
        }
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/debates`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Basic c2ViYToxMjM0NTY='
            },
            body: JSON.stringify(debate),
        });
        return (await response.json());
    },
    zod$({
        community_id: z.number(),
        creator_id: z.string(),
        description: z.string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        }).max(5000, { message: "Must be 5000 or fewer characters long" }),
        image_url: z.string().optional(),
        image: z.instanceof(Blob).optional(),
        public: z.string().optional(),
        tags: z.array(z.string()).optional(),
        title: z
            .string()
            .min(5, { message: "Title must be at least 5 characters long" })
            .max(100, { message: "Title must be 100 characters or less" }),
        type: z.string(),
        status: z.string(),
    })
);

export const usePostPoll = routeAction$(
    async (poll, { sharedMap }) => {
        const session = sharedMap.get('session');
        const token = session?.accessToken;

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/polls`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(poll),
            });
            return (await response.json());
        } catch (err) {
            return err
        }
    },
    zod$({
        status: z.enum(["OPEN", "CLOSED"]),
        poll_type: z.string(),
        title: z
            .string()
            .min(5, { message: "Title must be at least 5 characters long" })
            .max(100, { message: "Title must be 100 characters or less" }),
        description: z.string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        }).max(5000, { message: "Must be 5000 or fewer characters long" }),
        options: z.array(z.string()).min(2, { message: "Must have at least 2 options" }),
        community_id: z.string(),
        tags: z.array(z.string()).optional(),
        token: z.string(),
    })
);

export const useVotePoll = routeAction$(
    async (data, { sharedMap }) => {
        const session = sharedMap.get('session');
        const token = session?.accessToken;
        const { pollId } = data
        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/polls/${pollId}/vote`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ option_ids: data.optionIds }),
            });
            return (await response.json());
        } catch (err) {
            console.error('err', err)
            return err
        }
    }
)

export const useReactToPoll = routeAction$(
    async (data, { sharedMap }) => {
        const session = sharedMap.get('session');
        const token = session?.accessToken;
        const { pollId } = data;
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/polls/${pollId}/react`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ reaction_type: data.reactionType }),
        });
        const result = await response.json();
        return result;
    }
);

export const useVoteOpinion = routeAction$(
    async (data, { sharedMap }) => {
        const session = sharedMap.get('session');
        const token = session?.accessToken;
        const { opinionId, value } = data;
        const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/opinions/${opinionId}/vote`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ value }),
        });
        const result = await response.json();
        return result;
    }
);

export const useFormPollLoader = routeLoader$<InitialValues<PollForm>>(({ pathname }) => {
    const segments = pathname.split('/').filter(Boolean);
    const communityType = segments[0];
    return {
        type: PollType.Binary,
        title: '',
        description: '',
        options: ['', ''],
        tags: [],
        endDate: {
            active: false,
            value: '',
        },
        is_anonymous: false,
        community_ids: communityType.toUpperCase() === "GLOBAL" ? ['1'] : [],
        community_type: communityType.toUpperCase(),
    };
});

export const useFormCountryLoader = routeLoader$<InitialValues<CountryForm>>(({ pathname }) => {
    console.log('pathname', pathname)
    return {
        country: '',
    };
});