import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "JEB Incubator",
    description: "JEB Incubator",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
            >
                <header>
                    <NavBar />
                </header>
                <section className="flex-grow">
                    {children}
                </section>
                <footer className="mt-16 pt-8 pb-6 border-t border-gray-200 bg-gray-50 mt-auto">
                    <p className="text-center text-gray-600">© 2025 JEB Incubator</p>
                </footer>{" "}
            </body>
        </html>
    );
}

