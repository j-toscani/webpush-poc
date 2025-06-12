export type PaginationOptions = { page: number; perPage: number };

export type Handler = (
  request: Request,
  params?: URLPatternResult,
  info?: Deno.ServeHandlerInfo,
) => Response | Promise<Response>;

export interface Route {
  pattern: URLPattern;
  method?: string | string[];
  handler: Handler;
}