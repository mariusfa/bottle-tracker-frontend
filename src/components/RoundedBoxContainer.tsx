import { ComponentChildren, FunctionalComponent } from 'preact';

interface Props {
    children: ComponentChildren,
    md?: boolean
}

export const RoundedBoxContainer: FunctionalComponent<Props> = ({children, md}) => {
    return (
        <div className={`w-full ${md ? 'max-w-md' : ''} mx-auto bg-white shadow-md rounded px-4 pt-6 pb-8 mb-4`}>
            {children}
        </div>
    );
}
