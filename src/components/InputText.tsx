import { FunctionalComponent, RefObject } from 'preact';

interface Props {
	placeholder?: string;
	name: string;
	value: string;
	onChange?: (event: Event) => void;
	type?: string;
	readonly?: boolean;
	inputRef?: RefObject<HTMLInputElement>;

}

export const InputText: FunctionalComponent<Props> = ({
	placeholder: label,
	name,
	value,
	onChange,
	type,
	readonly,
	inputRef
}) => {
	return (
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
			id={name}
			name={name}
			type={type}
			placeholder={label}
			value={value}
			onChange={onChange}
			readOnly={readonly}
			ref={inputRef}
		/>

	)
}
