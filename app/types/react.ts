import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";

export interface AsProp<C extends ElementType> {
  as?: C;
}

export type PolymorphicProps<
  P = Record<string, unknown>,
  C extends ElementType = "div",
> = PropsWithChildren<P> & AsProp<C> & ComponentPropsWithoutRef<C>;
