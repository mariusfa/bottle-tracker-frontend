import { ComponentChildren, FunctionalComponent } from 'preact';

interface Props {
    href: string;
    children: ComponentChildren
}

export const LinkText: FunctionalComponent<Props> = ({ href, children }) => {
    return (
        <a class="inline-block font-bold text-sm text-blue-600 hover:text-blue-800" href={href}>
            {children}
        </a>
    );
}
