import { ChangeEvent, useRef, useState } from "react";
import { Cross } from "./Icons.tsx";

type Props = {
  defaultValue: string | null;
};

const reader = new FileReader();

export function ImageInput({ defaultValue }: Props) {
  const [isChanged, setIsChanged] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputRef.current!.setAttribute("diabled", "true");
    const file = event.currentTarget?.files?.[0];
    if (!file) return;
    reader.onload = () => {
      if (!imageRef.current) return;
      imageRef.current.src = reader.result as string;
      inputRef.current!.setAttribute("diabled", "false");
      setIsChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const onRemoveClick = () => {
    if (!imageRef.current) return;
    imageRef.current.setAttribute("src", defaultValue ?? "");

    if (!inputRef.current) return;
    inputRef.current.value = "";
    setIsChanged(false);
  };

  return (
    <div className="relative">
      {isChanged && (
        <button
          onClick={onRemoveClick}
          type="button"
          className="absolute top-4 right-4 icon bg-red-700 text-white"
        >
          <Cross />
        </button>
      )}
      <img
        ref={imageRef}
        className="w-full h-auto max-w-md block mb-4 mx-auto"
        alt="Dieses Bild zeigt einen Serviervorschlag für das Gericht"
        src={defaultValue ?? ""}
      />
      <label className="w-full h-8 flex items-center justify-center border-1 rounded-md">
        Bild hochladen
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          name="image"
          id="image"
          onChange={onFileChange}
          accept="image/png, image/jpeg, image/webp"
        />
      </label>
    </div>
  );
}
