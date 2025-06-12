import { signIn } from "../client/index.ts";

const login = () =>
  signIn.social({
    provider: "github",
    errorCallbackURL: "/login?error=true",
    newUserCallbackURL: "/?welcome",
  });

export function Auth() {
  return (
    <main className="app-content">
      <button type="button" onClick={login}>Login with Github</button>
    </main>
  );
}
