export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl text-[#0a0a0a]">
            Full of chaos, powered by coffee, and driven by dreams
          </h2>
          <h1 className="text-3xl">SIMPLE DEV</h1>
          <h2 className="text-3xl text-[#0a0a0a]">
            SOMETHING FANCY IS COMING UP
          </h2>
        </div>
      </main>
    </div>
  );
}
