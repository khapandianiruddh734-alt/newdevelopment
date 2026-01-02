import "../styles/globals.css"";

export const metadata = {
  title: "AniMaster OCR",
  description: "Image & PDF to Text OCR Tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
