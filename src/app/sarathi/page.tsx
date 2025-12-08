// FILE: src/app/sarathi/page.tsx

export default function SarathiHome() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Sārathi</h1>

      <p className="mt-4">
        <a className="underline" href="/sarathi/life-report">
          Open Life Report →
        </a>
      </p>

      <p className="mt-2">
        <a className="underline" href="/sarathi/tools/birth-chart-reader">
          Open Birth-Chart Reader →
        </a>
      </p>

      <p className="mt-2">
        <a className="underline" href="/sarathi/tools/charts">
          Open Charts (D1/D9) →
        </a>
      </p>
    </main>
  );
}
