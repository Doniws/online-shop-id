import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Navbar from "@/components/layouts/Navbar";

export default function App({ Component, pageProps : {session , ...pageProps }}: AppProps) {
  return (
  <SessionProvider>
    <div>
      <Navbar />
      <Component {...pageProps} />
    </div>
  </SessionProvider>
  )
}
