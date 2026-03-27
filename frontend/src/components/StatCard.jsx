export default function StatCard({ label, value, tone = "default" }) {
  const toneClass =
    tone === "danger"
      ? "border-red-300 bg-red-50"
      : tone === "accent"
        ? "border-zinc-300 bg-zinc-100"
        : "border-zinc-200 bg-white";

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}
