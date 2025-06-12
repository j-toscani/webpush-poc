import { Outlet, useNavigate } from "react-router";
// @ts-types="@types/react"
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "./components/Header.tsx";
import { useSession } from "./client/index.ts";

export default function Layout() {
  const navigate = useNavigate();
  const {
    data: session,
    isPending,
    error,
  } = useSession();

  if (isPending) {
    return null;
  }

  if (error || !session) {
    navigate("/login");
  }

  return (
    <>
      <Header />
      <main className="app-content mt-8">
        <ErrorBoundary
          fallback={<div>Something went wrong!</div>}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}
