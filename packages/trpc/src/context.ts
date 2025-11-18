import { db } from "@time-tracker/database";

export const createContext = async () => {
  return {
    db,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
