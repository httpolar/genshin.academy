import type { LinksFunction, LoaderArgs, MetaFunction, SerializeFrom } from "@remix-run/node";
import type { RouteHandle } from "~/types/common";
import type { ThrownErrorResponse } from "~/utils/responses.server";

import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useMatches,
  useTransition,
} from "@remix-run/react";
import clsx from "clsx";
import { Provider as JotaiProvider } from "jotai";
import Nprogress from "nprogress";
import { useEffect, useState } from "react";
import { IntlProvider } from "use-intl";

import { jotaiStore } from "~/atoms/store";
import { Button } from "~/components/Button";
import { Footer } from "~/components/Footer";
import { Navbar } from "~/components/Navbar";
import { useColorScheme } from "~/hooks/use-color-scheme";
import { getColorScheme } from "~/utils/color-scheme/common.server";
import { getMessages, resolveLocale } from "~/utils/i18n.server";
import { getUser } from "~/utils/session.server";

import { Main } from "./components/Main";

import interCssUrl from "~/styles/inter.css";
import tailwindStylesheetUrl from "~/styles/tailwind.css";

export const handle: RouteHandle = {
  id: "root",
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "preload", href: interCssUrl, as: "style" },
    { rel: "stylesheet", href: interCssUrl },
  ];
};

export const meta: MetaFunction<typeof loader | undefined> = ({ data }) => ({
  title: "GENSHIN.ACADEMY",
  "color-scheme": Boolean(data?.colorScheme) ? data?.colorScheme : "dark light",
});

export async function loader({ request }: LoaderArgs) {
  const resolvedLocale = await resolveLocale(request);
  const messages = await getMessages(resolvedLocale, [
    "calc",
    "posts",
    "settings",
    "characters",
    "genshin",
  ]);

  return json({
    colorScheme: await getColorScheme(request),
    user: await getUser(request),
    locale: resolvedLocale,
    messages,
  });
}

export type Loader = SerializeFrom<typeof loader>;

function App({ locale }: { locale: string }) {
  const colorScheme = useColorScheme();

  const transition = useTransition();

  const matches = useMatches();
  const withScrollRestoration = matches.some(
    (m) => (m.handle as RouteHandle)?.withScrollRestoration === true,
  );

  const [cssTransitionsState, setCssTransitionsState] = useState(false);

  useEffect(() => {
    console.info(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    Nprogress.configure({
      showSpinner: false,
    });
  }, []);

  useEffect(() => {
    if (transition.state === "loading" || transition.state === "submitting") {
      Nprogress.start();
    } else {
      Nprogress.done();
    }
  }, [transition.state]);

  // this is to prevent the weird layout shift
  // on initial page loads for components with
  // transitions
  useEffect(() => {
    setTimeout(() => {
      setCssTransitionsState(true);
      console.info("CSS transitions are now enabled.");
    }, 1000);
  }, []);

  useEffect(() => {
    console.log({ withScrollRestoration });
  }, [withScrollRestoration]);

  return (
    <html lang={locale} className={clsx(colorScheme)}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body
        className={clsx(
          "h-full",
          "antialiased",
          cssTransitionsState === false && "transitions-be-gone",
        )}
      >
        <div className="app">
          <Navbar />
          <Outlet />
          <Footer />
        </div>

        {withScrollRestoration === true && <ScrollRestoration />}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function Root() {
  const { messages, locale } = useLoaderData<typeof loader>();

  return (
    <IntlProvider locale={locale} messages={messages}>
      <JotaiProvider store={jotaiStore}>
        <App locale={locale} />
      </JotaiProvider>
    </IntlProvider>
  );
}

export function CatchBoundary() {
  const caught = useCatch<ThrownErrorResponse>();

  return (
    <html className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width,initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body className="transitions-be-gone h-full">
        <div className="app">
          <Main>
            <Main.Container display="flex" className="flex-wrap items-center justify-center px-2">
              <div className="flex flex-col items-center gap-4">
                <div className="flex text-2xl">
                  <h2 className="mr-2 border-r border-black pr-2 font-bold">{caught.status}</h2>
                  <p>{caught.data?.message || caught.statusText}</p>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 md:flex-row ">
                  {caught?.status === 403 || caught?.status === 401 ? (
                    <Form action="/logout" method="post">
                      <Button type="submit" className="w-fit text-center">
                        Log Out
                      </Button>
                    </Form>
                  ) : (
                    <Button as={Link} to="/">
                      Go to home page
                    </Button>
                  )}
                </div>
              </div>
            </Main.Container>
          </Main>
        </div>
      </body>
    </html>
  );
}
