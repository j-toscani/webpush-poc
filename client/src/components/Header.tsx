import { NavLink } from "./Link.tsx";

export function Header() {
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
      </nav>
    </header>
  );
}
