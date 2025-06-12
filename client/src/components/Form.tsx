// @ts-types="@types/react"
import {
  type FormEvent,
  type FormHTMLAttributes,
  type PropsWithChildren,
  useState,
} from "react";

type Props =
  & PropsWithChildren<{
    onSubmit: (data: FormData) => Promise<void>;
    onSuccess?: (data: FormData, e: FormEvent<HTMLFormElement>) => void;
    onError?: (e: Error) => void;
  }>
  & Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onError">;

export function FormGroup({
  children,
  label,
  name,
  className,
}: PropsWithChildren<{ className?: string; label: string; name: string }>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="inline-block my-4 font-semibold text-xl">
        {label}
      </label>
      <br />
      {children}
    </div>
  );
}

export function Form({
  children,
  onSubmit,
  onSuccess,
  onError,
  ...rest
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);

    try {
      await onSubmit(formData);
      onSuccess?.(formData, event);
    } catch (error: unknown) {
      onError?.(error as Error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form {...rest} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <fieldset disabled={isPending}>
        {children}
        <div>
          <button type="submit">Abschicken</button>
        </div>
      </fieldset>
    </form>
  );
}
