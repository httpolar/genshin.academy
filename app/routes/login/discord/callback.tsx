import type { HeadersFunction, LoaderArgs } from "@remix-run/node";

import { Link, useCatch } from "@remix-run/react";

import { Main } from "~/components/Main";
import { getUserByDiscordAccount } from "~/models/user.server";
import { exchageDiscordCode, getDiscordAccount } from "~/utils/oauth/discord.server";
import { badRequest, unauthorized } from "~/utils/responses.server";
import { createUserSession } from "~/utils/session.server";

export const headers: HeadersFunction = () => ({
  "X-Robots-Tag": "noindex",
});

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);

  const discordCode = url.searchParams.get("code");
  if (!discordCode) {
    throw badRequest({ message: "Discord OAuth code was not provided" });
  }

  const tokenData = await exchageDiscordCode(discordCode, { type: "login" });
  const discordAccount = await getDiscordAccount(tokenData.access_token);

  const user = await getUserByDiscordAccount(discordAccount.id);
  if (!user) {
    throw unauthorized({
      message: "There's is no user account associated with your Discord account.",
    });
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: true,
    redirectTo: "/me",
  });
}

export default function LoginDiscordCallbackRoute() {
  return <div>Logging in...</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Main>
      <Main.Container display="flex" className="flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{caught.status}</h1>
        <h4 className="opacity-70">{caught.statusText ?? caught.data}</h4>

        <Link to="/login" role="button" className="mt-4">
          Back to login
        </Link>
      </Main.Container>
    </Main>
  );
}
