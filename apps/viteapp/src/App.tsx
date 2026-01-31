import { useQuery } from "@tanstack/react-query";
import { trpc } from "./utils/trpc";

export default function App() {
  const hello = useQuery(trpc.hello.queryOptions("Typescript"));

  if (hello.isLoading) return <div>Loading...</div>;
  if (hello.error) return <div>Error: {hello.error.message}</div>;

  return <div>{hello.data}</div>;
}
