import { component$ } from '@builder.io/qwik';
import { useSignIn } from '~/routes/plugin@auth';
//Images
// import ImgGoogleLogo from '~/media/icons/google-logo.svg?jsx';
import ImgGithub from '~/icons/github.svg?jsx';

export default component$(() => {
    const signInSig = useSignIn()
    return (
        <div class="space-y-2">
            {/* <button class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <ImgGoogleLogo aria-label="Google" class="w-5 h-5 mr-2" />
            Continuar con Google
            </button> */}
            <button
                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick$={() => signInSig.submit({ providerId: 'github', options: { redirectTo: "/" } })}
            >
                <ImgGithub aria-label="Github" class="w-5 h-5 mr-2" />
                Continue with Github
            </button>
        </div>
    );
});
