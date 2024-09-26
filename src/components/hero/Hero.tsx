import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import SocialLoginButtons from '~/components/SocialLoginButtons';

export default component$(() => {
    return (
        <div class="bg-gradient-to-r from-slate-700 to-slate-900 text-white w-full min-h-screen flex items-center justify-center px-6 py-12">
            <div class="max-w-6xl w-full grid grid-cols-1 md:grid-cols-7 gap-8">
                <div class="md:col-span-5 space-y-6">
                    <h1 class="text-4xl font-bold leading-tight">Transform Communities Together</h1>
                    <h2 class="text-xl font-light">Join discussions, solve problems, and build a better future with Geounity.</h2>
                    <ul class="space-y-4 text-lg">
                        <li>🌍 <a href="#" class="text-blue-400 hover:underline">Connect globally, nationally, and locally.</a> Share your voice where it matters.</li>
                        <li>💬 <a href="#" class="text-blue-400 hover:underline">Join structured discussions.</a> Discover perspectives from around the world.</li>
                        <li>⚠️ <a href="#" class="text-blue-400 hover:underline">Report community issues</a> and collaborate on solutions.</li>
                        <li>📊 <a href="#" class="text-blue-400 hover:underline">Access real-time data</a> that reflects community needs.</li>
                        <li>🤝 <a href="#" class="text-blue-400 hover:underline">Start projects</a> that make a real impact on your environment.</li>
                        <li>🤖 <a href="#" class="text-blue-400 hover:underline">Help develop AI solutions</a> that learn from community feedback.</li>
                    </ul>
                </div>
                <div class="md:col-span-2 flex justify-center items-center">
                    <div class="bg-white text-gray-900 rounded-lg shadow-lg p-8 space-y-4 w-full max-w-md">
                        <form class="space-y-4">
                            <input type="text" placeholder="Enter your email" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Join Now</button>
                        </form>
                        <SocialLoginButtons />
                    </div>
                </div>
            </div>
        </div>
    );
});

export const head: DocumentHead = {
    title: "Welcome to Geounity",
    meta: [
        {
            name: "description",
            content: "Geounity",
        },
    ],
};
