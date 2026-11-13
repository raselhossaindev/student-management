import "./globals.css";

export const metadata = {
  title: "StudentHub | Student Management",
  description: "Student CRUD dashboard built with Next.js, Tailwind CSS, MongoDB and Mongoose.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
