import { mergeCN } from "../lib/index.ts";
import { Logout } from "./Icons.tsx";
type GithubUser = {
  "id": number | string;
  "name": string;
  "email": string;
  "emailVerified": boolean;
  "image"?: string | null;
  "createdAt": Date | string;
  "updatedAt": Date | string;
};

type Props = {
  user: GithubUser;
  onLogout: () => void;
  className?: string;
};

export function GithubUserProfile({ user, onLogout, className }: Props) {
  return (
    <div className={mergeCN("flex gap-2 place-items-center", className)}>
      {user.image && (
        <img
          src={user.image}
          width="40"
          height="40"
          alt={`Das Profilbild von ${user.name}`}
        />
      )}
      <span className="hidden sm:inline">{user.name}</span>
      <button
        type="button"
        className="icon ml-4 bg-red-600"
        onClick={onLogout}
      >
        <Logout />
      </button>
    </div>
  );
}
