type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-6 md:px-10 md:py-10">
      {children}
    </main>
  );
}
