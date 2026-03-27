export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[180px] w-full items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white/90 px-4 py-2 shadow-sm">
        <span className="h-2.5 w-2.5 animate-ping rounded-full bg-red-600" />
        <span className="text-sm font-medium text-zinc-700">{label}</span>
      </div>
    </div>
  );
}
