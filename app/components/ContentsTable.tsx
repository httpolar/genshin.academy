import type { FC } from "react";

import { useTranslations } from "use-intl";

interface Props {
  title?: string;
  headings: Array<
    {
      id?: string | null;
      value?: string | null;
    } & Record<string, unknown>
  >;
  containerClassName?: string;
}

export const ContentsTable: FC<Props> = ({ title, headings, containerClassName }) => {
  const t = useTranslations();

  return (
    <div className={`contents-table-container ${containerClassName}`}>
      <div className="card sticky right-0 top-[calc(var(--header-height)_+_var(--default-gap))] w-60 overflow-y-auto">
        <div className="flex w-full flex-col gap-y-2">
          <div className="mb-0 self-center border-b border-gray-200 pb-3 dark:border-neutral-700">
            <h1 className="font-semibold dark:text-neutral-300">{title ?? t("common.contents")}</h1>
          </div>

          <div className="flex flex-col gap-y-0">
            {headings.map((heading) => (
              <a
                key={`guide-nav-${heading.id}`}
                href={`#${heading.id}`}
                className="block rounded-lg px-4 py-2 text-sm font-medium capitalize text-neutral-700 hover:bg-gray-100 dark:text-neutral-400"
              >
                {heading.value}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
