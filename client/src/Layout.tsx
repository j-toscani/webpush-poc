import { Outlet } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "./components/Header.tsx";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="app-content mt-8">
        <ErrorBoundary
          fallback={<div>Something went wrong!</div>}
        >
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
}
