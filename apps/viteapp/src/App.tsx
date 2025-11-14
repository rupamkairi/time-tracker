import { trpc } from "./utils/trpc";

function App() {
  const hello = trpc.hello.useQuery("TypeScript");

  return (
    <>
      <div>{hello.data}</div>
    </>
  );
}

export default App;
