import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { LuFacebook, LuTwitter, LuInstagram, LuYoutube } from "@qwikest/icons/lucide";
import { QwikLogo } from '~/icons/qwik';
import { Button } from "~/components/ui";

interface FooterProps {
    currentYear: number;
}

const socialMedia = [
    {
        label: 'Facebook',
        link: '/facebook',
        icon: () => <LuFacebook />,
    },
    {
        label: 'Twitter',
        link: '/twitter',
        icon: () => <LuTwitter />,
    },
    {
        label: 'Instagram',
        link: '/instagram',
        icon: () => <LuInstagram />,
    },
    {
        label: 'Youtube',
        link: '/youtube',
        icon: () => <LuYoutube />,
    },
];

const bottomLinks = [
    {
        label: 'Terms',
        link: '/terms-of-service',
    },
    {
        label: 'Privacy policy',
        link: '/privacy-policy',
    },
];

export default component$<FooterProps>(({ currentYear }) => {
    return (
        <footer class="bg-neutral-100 mt-auto w-full">
            <hr />
            <div class="bg-neutral-900 justify-end px-4 py-10 md:py-6 w-full">
                <div class="bg-neutral-900 justify-end px-4 py-10 md:flex md:py-6 w-full">
                    <div class="flex justify-center py-2 gap-x-4 md:self-start">
                        {socialMedia.map(({ icon: Icon, label, link }) => (
                            <Link href={link}>
                                <Button
                                    aria-label={`Go to ${label} page`}
                                    key={label}
                                    class="text-white active:text-white hover:text-white hover:!bg-neutral-500 active:bg-transparent"
                                    look="link"
                                >
                                    <div class="text-xl">
                                        <Icon />
                                    </div>
                                </Button>
                            </Link>
                        ))}
                    </div>
                    <div class="flex items-center justify-center gap-6 py-2 my-4 md:ml-auto md:my-0">
                        {bottomLinks.map(({ label, link }) => (
                            <Link
                                key={label}
                                class="text-white no-underline typography-text-sm active:text-white active:underline hover:text-white hover:underline"
                                href={link}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
                <p class="flex items-center justify-center py-2 leading-5 text-center typography-text-sm text-white/50 font-body md:ml-6">
                    <span class="ml-2">©{currentYear} Geounity.&nbsp;</span>
                    <span class="flex items-center">
                        Developed with &nbsp; <a href="https://qwik.dev/"><QwikLogo height={20} width={55} /></a> &nbsp; by &nbsp; <a href="https://sebastiancardoso.com/" target="_blank">SC</a>
                    </span>
                </p>
            </div>
        </footer>

    );
});

