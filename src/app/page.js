import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">AniMaster Suite</h1>
      <p className="text-gray-500 mb-6">
        Free tools for PDFs, images, and data
      </p>

      <Link
        href="/ocr"
        className="bg-black text-white px-6 py-3 rounded-lg font-semibold"
      >
        Open OCR Tool
      </Link>
    </main>
  );
}
