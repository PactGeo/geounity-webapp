import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { LuEye } from "@qwikest/icons/lucide";
import { _ } from "compiled-i18n";
import SocialLoginButtons from '~/components/SocialLoginButtons';
import TierraGirando from "~/components/TierraGirando";

export default component$(() => {
    return (
        <div class="bg-gradient-to-r from-slate-700 to-slate-900 text-white w-full min-h-screen">
            <div class="flex items-center justify-center px-6 py-12">
                <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-7 gap-8">
                    <div class="md:col-span-5 space-y-6">
                        <h1 class="text-4xl font-bold leading-tight">{_`Empower Your Communities with Geounity`}</h1>
                        <h2 class="text-xl font-light">{_`Participate in surveys, engage in debates, and drive impactful projects to build a better future.`}</h2>
                        <ul class="space-y-4 text-lg">
                            <li>
                                🌍 <a href="#" class="text-blue-400 hover:underline">{_`Create and Participate in Surveys`}</a> {_`Gather opinions and data at global, national, and local levels.`}
                            </li>
                            <li>
                                💬 <a href="#" class="text-blue-400 hover:underline">{_`Engage in Structured Debates`}</a> {_`Join discussions organized by administrative divisions.`}
                            </li>
                            <li>
                                ⚠️ <a href="#" class="text-blue-400 hover:underline">{_`Report Community Issues`}</a> {_`Inform relevant institutions and collaborate on solutions.`}
                            </li>
                            <li>
                                📊 <a href="#" class="text-blue-400 hover:underline">{_`Access Real-Time Data`}</a> {_`View statistics and trends that reflect your community's needs.`}
                            </li>
                            <li>
                                🤝 <a href="#" class="text-blue-400 hover:underline">{_`Launch Community Projects`}</a> {_`Develop and fund initiatives that address local challenges.`}
                            </li>
                            <li>
                                🚀 <a href="#" class="text-blue-400 hover:underline">{_`Upcoming Tools`}</a> {_`Soon, collaborate on AI-driven solutions and other innovative features.`}
                            </li>
                        </ul>
                    </div>
                    <div class="md:col-span-2 flex justify-around items-center flex-col">
                        <div class="bg-white text-gray-900 rounded-lg shadow-lg p-8 space-y-4 w-full max-w-md">
                            <SocialLoginButtons />
                        </div>
                        <button
                            type="button"
                            class="w-full py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 hover:text-gray-900 shadow-sm mt-4"
                        >
                            <Link href="/global" class="flex justify-center items-center space-x-2">
                                <LuEye class="text-gray-700" />
                                <span>{_`Observer Mode`}</span>
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
            <TierraGirando />
        </div>
    );
});

export const head: DocumentHead = {
    title: _`Welcome to Geounity`,
    meta: [
        {
            name: "description",
            content: "Geounity empowers communities worldwide to connect, collaborate, and create impactful solutions.",
        },
    ],
};
