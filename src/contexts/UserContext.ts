import { createContextId } from '@builder.io/qwik';

export interface UserType {
    id: number;
    name: string;
    email: string;
    image: string;
    username: string;
    bio: string;
    location: string;
    website: string;
    banner: string;
    role: string;
    isAuthenticated: boolean;
}

export const UserContext = createContextId<UserType>('app.user-context');
