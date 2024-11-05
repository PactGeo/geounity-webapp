import { component$, useStylesScoped$ } from '@builder.io/qwik';
import styles from "./tierra-girando.css?inline";

export const TierraGirando = component$(() => {
    useStylesScoped$(styles);
    return (
        <div class="container-tierra-girando">
            <div class="map"></div>
        </div>
    );
});

export default TierraGirando;