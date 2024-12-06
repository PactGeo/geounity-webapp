import { createContextId, type Signal } from '@builder.io/qwik';

export const MenuContext = createContextId<Signal<boolean>>('app.menu-context');
