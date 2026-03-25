import Link from "next/link";

const navItems = [
  { href: "/", label: "トップ" },
  { href: "/apis", label: "API体験" },
  { href: "/trials", label: "研究アプリ体験" },
  { href: "/insights", label: "技術情報" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 md:px-10">
        <Link href="/" className="text-sm font-bold tracking-wide text-slate-900 dark:text-white">
          AI大学HUB
        </Link>
        <nav>
          <ul className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-xs text-slate-700 transition hover:bg-slate-100 md:text-sm dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
