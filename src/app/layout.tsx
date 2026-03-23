import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";

import "./globals.css";

export const metadata: Metadata = {
  title: "SubsVault",
  description: "Track subscriptions, renewal dates, accounts, and payment methods in one focused place."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var storageKey = "subsvault-theme";
                var savedTheme = window.localStorage.getItem(storageKey);
                var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                var theme = savedTheme === "dark" || savedTheme === "light"
                  ? savedTheme
                  : systemDark
                    ? "dark"
                    : "light";

                document.documentElement.dataset.theme = theme;
              })();
            `
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
