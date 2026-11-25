import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-[var(--bg)]">
      <p className="text-8xl font-black text-[var(--text-primary)] leading-none">404</p>
      <h1 className="text-xl font-semibold text-[var(--text-primary)]">Page not found</h1>
      <p className="text-sm text-[var(--text-muted)] max-w-sm text-center">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-[var(--radius)] bg-[var(--accent)] px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </main>
  );
}
