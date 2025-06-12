// @ts-types="@types/react"
import type {
  InputHTMLAttributes, // @ts-types="@types/react"
  TextareaHTMLAttributes,
} from "react";
import { FormGroup } from "./Form.tsx";

type Props = {
  label: string;
  name: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({ name, ...rest }: Omit<Props, "label">) {
  return <input name={name} {...rest}></input>;
}
export function TextArea({
  name,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea name={name} {...rest}>
    </textarea>
  );
}
export function TextInput({ name, label, ...rest }: Props) {
  return (
    <FormGroup label={label} name={name}>
      <Input name={name} {...rest} />
    </FormGroup>
  );
}
