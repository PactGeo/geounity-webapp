import { routeLoader$, routeAction$, zod$, z } from "@builder.io/qwik-city";

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
        community_id: z.string(),
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
    async (poll) => {
        console.log('============================================')
        console.log('usePostPoll')
        console.log('poll', poll)

        const response = await fetch('http://localhost:8000/polls', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Basic c2ViYToxMjM0NTY='
            },
            body: JSON.stringify(poll),
        });
        return (await response.json());
    },
    zod$({
        status: z.string(),
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
    })
);