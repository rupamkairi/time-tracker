import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@time-tracker/trpc";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:10000/trpc", // Your Hono server URL
    }),
  ],
});
