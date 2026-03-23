"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navigationItems = [
  { href: "/", label: "Dashboard" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/accounts", label: "Accounts" },
  { href: "/payment-methods", label: "Payment methods" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <main className="auth-shell">{children}</main>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <Link className="brand-link" href="/">
            SubsVault
          </Link>
          <p className="brand-copy">
            Personal subscription tracking with practical renewal and review workflows.
          </p>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(pathname, item.href) ? "nav-link nav-link-active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer sidebar-tools">
          <ThemeToggle />
          <form action="/auth/logout" method="post">
            <button className="button button-ghost theme-toggle" type="submit">
              Log out
            </button>
          </form>
        </div>
      </aside>

      <main className="content-shell">{children}</main>
    </div>
  );
}
