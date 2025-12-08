// components/Footer.jsx

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <span>
          © {new Date().getFullYear()} STONICAI • Structural Health Monitoring
        </span>
        <span className="text-[10px] sm:text-xs">
          Built with Next.js, Tailwind CSS & edge-deployable ML.
        </span>
      </div>
    </footer>
  );
}
