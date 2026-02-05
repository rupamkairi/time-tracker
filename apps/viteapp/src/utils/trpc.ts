import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@time-tracker/trpc";

export const trpc = createTRPCReact<AppRouter>();
