"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export default function OCRPage() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const extractImageText = async (image) => {
    const result = await Tesseract.recognize(image, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    });
    return result.data.text;
  };

  const extractPDFText = async (pdfFile) => {
    const buffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let finalText = "";

    for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
      finalText += await extractImageText(canvas.toDataURL("image/png"));
    }
    return finalText;
  };

  const handleOCR = async () => {
    if (!file) {
      setError("Please upload a file.");
      return;
    }

    setLoading(true);
    setError("");
    setText("");

    try {
      const output =
        file.type === "application/pdf"
          ? await extractPDFText(file)
          : await extractImageText(file);

      setText(output);
    } catch {
      setError("OCR failed. Try a clearer file.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">
        OCR – Image & PDF to Text
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Files are processed locally in your browser.
      </p>

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={handleOCR}
        disabled={loading}
        className="mt-4 w-full bg-black text-white py-3 rounded-lg"
      >
        {loading ? "Processing..." : "Extract Text"}
      </button>

      {loading && (
        <p className="text-center mt-2">{progress}%</p>
      )}

      {error && (
        <p className="text-red-500 text-center mt-3">{error}</p>
      )}

      {text && (
        <textarea
          value={text}
          readOnly
          className="w-full h-64 mt-6 p-4 border rounded-lg"
        />
      )}
    </div>
  );
}
