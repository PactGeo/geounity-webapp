import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";
interface Poll {
    status: string;
    poll_type: string;
    title: string;
    description?: string;
    options: string[];
    community_id: number;
    token?: string;
}

export const useServerTimeLoader = routeLoader$(() => {
    return {
        date: new Date().toISOString(),
    };
});

export const useGetTags = routeLoader$(async () => {
    const response = await fetch('http://localhost:8000/tags', {
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

export const useGetPolls = routeLoader$(async ({ sharedMap }) => {
    const session = sharedMap.get('session');
    const token = session?.accessToken;
    const response = await fetch('http://localhost:8000/polls', {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data as Array<any>
});

export const useGetDiscussions = routeLoader$(async ({ sharedMap }) => {
    console.log('useGetDiscussions')
    const session = sharedMap.get('session');
    const token = session?.accessToken;
    console.log('token', token)
    const response = await fetch('http://localhost:8000/debates/global', {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
    const data = await response.json();
    return data as Array<any>
});

export const useGetGlobalDebates = routeLoader$(async () => {
    const response = await fetch('http://localhost:8000/debates?debate_type=GLOBAL', {
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
    console.log('uploadImage')
    const response_signature = await fetch('http://localhost:8000/cloudinary/generate_signature', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Basic c2ViYToxMjM0NTY='
        },
    });
    const data_signature = await response_signature.json();
    console.log('data_signature', data_signature)
    const formdata = new FormData();
    formdata.append("signature", data_signature.signature);
    formdata.append("timestamp", data_signature.timestamp);
    formdata.append("api_key", data_signature.api_key);
    formdata.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    formdata.append("file", file);
    const endpoint = "https://api.cloudinary.com/v1_1/" + import.meta.env.VITE_CLOUDINARY_CLOUD_NAME + "/auto/upload";
    console.log('endpoint', endpoint)
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
        console.log('============================================')
        console.log('usePostDebate')
        console.log('debate', debate)

        const response = await fetch('http://localhost:8000/debates', {
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
        console.log('====================================== usePostPoll ====================================================')
        console.log('usePostPoll')
        console.log('poll', poll)
        console.log('token', token)

        try{
            const response = await fetch('http://localhost:8000/polls', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(poll),
            });
            console.log('response', response)
            return (await response.json());
        } catch (err) {
            console.log('err', err)
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
        console.log('data', data)
        const session = sharedMap.get('session');
        const token = session?.accessToken;
        console.log('useVotePoll')
        console.log('ids', data.option_ids)
        console.log('token', token)
        const { pollId } = data 
        console.log('pollId', pollId)
        try {
            const response = await fetch(`http://localhost:8000/polls/${pollId}/vote`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ option_ids: data.optionIds }),
            });
            console.log('response ################', response)
            return (await response.json());
        } catch (err) {
            console.log('err', err)
            return err
        }
    }
)

export const useReactToPoll = routeAction$(
    async (data, { sharedMap }) => {
        const session = sharedMap.get('session');
        const token = session?.accessToken;
        const { pollId } = data;
        const response = await fetch(`http://localhost:8000/polls/${pollId}/react`, {
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
