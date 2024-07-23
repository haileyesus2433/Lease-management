import Navbar from "@/components/Navbar";
import Provider from "@/components/SessionProvider";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Provider>
          <Toaster position="top-right" />
          <main className="h-full  mt-16 sm:h-screen flex flex-col  items-center">
            <Navbar />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
