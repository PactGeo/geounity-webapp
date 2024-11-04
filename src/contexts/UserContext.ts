import { createContextId } from '@builder.io/qwik';

export interface UserType {
    name: string;
    email: string;
    image: string;
    isAuthenticated: boolean;
}

export const UserContext = createContextId<UserType>('app.user-context');
