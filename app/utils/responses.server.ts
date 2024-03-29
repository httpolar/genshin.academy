import type { ThrownResponse } from "@remix-run/react";

import { json } from "@remix-run/node";

export type TypedJsonError<Code = string, Message = string, Cause = Error> = {
  code: Code | null;
  message: Message | null;
  details: Message | null;
  cause: Cause | null;
};

export type TypedErrorResponse<Code = string, Message = string, Cause = Error> = {
  code?: Code;
  message?: Message;
  details?: Message;
  cause?: Cause;
};

export type ThrownErrorResponse = ThrownResponse<number, TypedErrorResponse>;

export const typedError = <Code = string, Message = string, Cause = Error>(
  data: TypedErrorResponse<Code, Message, Cause>,
) => {
  return data;
};

export function badRequest<T = TypedErrorResponse>(data: T) {
  return json(data, { status: 401, statusText: "Bad Request" });
}

export function unauthorized<T = TypedErrorResponse>(data: T) {
  return json(data, { status: 401, statusText: "Unauthorized" });
}

export function forbidden<T = TypedErrorResponse>(data: T) {
  return json(data, { status: 403, statusText: "Forbidden" });
}

export function notFound<T = TypedErrorResponse>(data: T) {
  return json(data, { status: 404, statusText: "Not Found" });
}

export function serverError<T = TypedErrorResponse>(data: T) {
  return json(data, { status: 500, statusText: "Internal Server Error" });
}
