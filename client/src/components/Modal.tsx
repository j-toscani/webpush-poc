// @ts-types="@types/react"
import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";
// @ts-types="@types/react-dom"
import { createPortal } from "react-dom";
import { Cross } from "./Icons.tsx";

type Props = PropsWithChildren<
  {
    shortCut?: string;
    className?: string;
    triggerLabel?: ReactNode;
    onConfirm?: () => void;
    onClose?: () => void;
  }
>;

export function Modal(
  { children, onConfirm, onClose, triggerLabel, className, shortCut }: Props,
) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  function openDialog() {
    dialogRef?.current?.showModal();
  }
  function closeDialog() {
    dialogRef?.current?.close();
  }

  useEffect(() => {
    if (!shortCut) return;

    const handler = (event: KeyboardEvent) => {
      if (!event.shiftKey || !event.metaKey) return;
      if (event.code !== `Key${shortCut}`) return;
      if (dialogRef.current?.open) return;
      openDialog();
    };

    document.body.addEventListener("keydown", handler);

    return () => document.body.removeEventListener("keydown", handler);
  }, [shortCut]);

  return (
    <>
      <button type="button" className={className} onClick={openDialog}>
        {triggerLabel ? triggerLabel : "Open Dialog"}
      </button>
      {createPortal(
        <dialog
          ref={dialogRef}
        >
          {children ? children : (
            <p>
              Jo! What up?!
            </p>
          )}

          <div>
            <button
              type="button"
              className="icon absolute top-4 right-4 bg-transparent text-black"
              onClick={() => {
                onClose?.();
                closeDialog();
              }}
            >
              <Cross />
            </button>
            {onConfirm && (
              <button
                type="submit"
                onClick={() => {
                  onConfirm?.();
                  closeDialog();
                }}
              >
                Speichern
              </button>
            )}
          </div>
        </dialog>,
        document.body,
      )}
    </>
  );
}
