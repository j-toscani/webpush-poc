import { NavLink as Link, useNavigate } from "react-router";
// @ts-types="@types/react-dom"
import { flushSync } from "react-dom";
// @ts-types="@types/react"
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  to: string;
  className?: string;
}>;

export function NavLink({ to, children, className }: Props) {
  const navigate = useNavigate();
  return (
    <Link
      className={className}
      to={to}
      onClick={(e) => {
        e.preventDefault();
        if (!document?.startViewTransition) {
          navigate(to);
        } else {
          document?.startViewTransition(() => {
            flushSync(() => {
              navigate(to);
            });
          });
        }
      }}
    >
      {children}
    </Link>
  );
}
