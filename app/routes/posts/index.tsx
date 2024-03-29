import type { LoaderArgs, MetaFunction, SerializeFrom } from "@remix-run/node";
import type { ChangeEvent, FormEvent } from "react";
import type { RouteHandle } from "~/types/common";
import type { UserLocale } from "~/utils/locales";

import { json, Response } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslations } from "use-intl";

import { PostCard } from "~/components/cards/PostCard";
import { Container } from "~/components/Container";
import { Paginator } from "~/components/Paginator";
import { Paper } from "~/components/Paper";
import { countSearchPostsPaginated, searchPostsPaginated } from "~/models/posts.server";
import { PostsSearch } from "~/schemas/posts.server";
import { orUndefined } from "~/utils/helpers";
import { supportedLocales } from "~/utils/locales";

export const handle: RouteHandle = {
  id: "posts",
  withScrollRestoration: true,
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const pageParam = url.searchParams.get("page");
  const page = pageParam != null ? parseInt(pageParam.toString()) : 1;
  const postsPerPage = 6;

  const searchLang = orUndefined(url.searchParams.get("lang"));

  const parseResult = PostsSearch.safeParse({
    skip: (page - 1) * postsPerPage,
    take: postsPerPage,
    order: url.searchParams.get("order") ?? undefined,
    authorName: url.searchParams.get("author") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
    query: url.searchParams.get("search")?.toString().trim().replaceAll(/\s+/gi, " & "),
    lang: searchLang,
  });

  if (parseResult.success !== true) {
    throw new Response("Bad Request", { status: 400, statusText: "Bad Request" });
  }

  const { skip, take, lang, order, type, authorName, query: searchTitle } = parseResult.data;
  const searchOptions = {
    skip,
    take,
    lang,
    order,
    type,
    authorName,
    searchTitle,
  };

  const totalPosts = await countSearchPostsPaginated(searchOptions);
  const posts = await searchPostsPaginated(searchOptions);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return json({ posts, totalPages, page, searchLang });
};

type LoaderData = SerializeFrom<typeof loader>;

export const meta: MetaFunction = () => {
  return {
    title: "Posts - GENSHIN.ACADEMY",
  };
};

const PostsIndexRoute = () => {
  const t = useTranslations();

  const { posts, page, totalPages, searchLang } = useLoaderData() as LoaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search-query");

    if (typeof searchQuery !== "string") {
      return;
    }

    const newSearchParams = new URLSearchParams(searchParams);
    if (!searchQuery) {
      newSearchParams.delete("search");
    } else {
      newSearchParams.set("search", searchQuery);
    }

    setSearchParams(newSearchParams);
  };

  const handleLanguageSelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (!supportedLocales.includes(e.target.value as UserLocale)) {
      newSearchParams.delete("lang");
    } else {
      newSearchParams.set("lang", e.target.value);
    }

    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    console.log(searchLang);
  }, []);

  return (
    <Container className="px-0 pt-0 lg:px-[var(--default-gap)]">
      <div className="grid h-full grid-rows-[auto_auto] gap-[var(--default-gap)] lg:grid-cols-[1fr_auto] lg:grid-rows-1">
        <Paper className="card sticky top-[var(--header-height)] z-[5] flex h-fit w-full flex-col rounded-none border-b border-t-0 bg-white lg:top-[calc(var(--header-height)_+_var(--default-gap))] lg:w-64 lg:rounded-md lg:border-r lg:border-l lg:border-t">
          <form onSubmit={handleSearchSubmit}>
            <div>
              <label htmlFor="search-query" className="text-xs font-bold uppercase opacity-60">
                {t("common.query")}
              </label>
              <input
                id="search-query"
                name="search-query"
                placeholder={t("common.enter-query")}
                className="input mb-2 w-full"
              />
            </div>
          </form>

          <div className="flex flex-col">
            <label htmlFor="search-language" className="text-xs font-bold uppercase opacity-60">
              {t("common.language")}
            </label>
            <select
              id="search-language"
              defaultValue={searchLang}
              onChange={handleLanguageSelect}
              className="select mb-2"
            >
              <option value={undefined}>Any</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          <Paginator page={page} totalPages={totalPages} />
        </Paper>

        {posts.length <= 0 && (
          <div className="flex h-full w-full items-center justify-center lg:row-end-1">
            Nothing here :(
          </div>
        )}

        {posts.length > 0 && (
          <div className="columns-1 space-y-[var(--default-gap)] px-[var(--default-gap)] lg:row-end-1 lg:columns-2 lg:px-0 lg:pt-[var(--default-gap)]">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                description={post.description}
                thumbnailUrl={post.thumbnailUrl}
                publishedAt={new Date(post.publishedAt)}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default PostsIndexRoute;
