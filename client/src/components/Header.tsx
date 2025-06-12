import { NavLink } from "./Link.tsx";
import { signOut, useSession } from "../client/index.ts";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import { GithubUserProfile } from "./GithubUser.tsx";

export function Header() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  const logout = useCallback(async () => {
    await signOut();
    navigate("/login");
  }, []);

  return (
    <header className="app-content-full app-layout mt-4 sticky top-0 bg-white">
      <nav className="app-content flex gap-4 py-3 items-center">
        <NavLink to="/">
          <img
            width="40"
            height="40"
            className="rounded-full"
            src="/logo_small.png"
          />
        </NavLink>

        {session && (
          <GithubUserProfile
            onLogout={logout}
            user={session.user}
            className="ml-auto"
          />
        )}
      </nav>
    </header>
  );
}
