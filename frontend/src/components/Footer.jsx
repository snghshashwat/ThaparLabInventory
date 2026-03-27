export default function Footer({ user }) {
  return (
    <footer
      className="sticky bottom-0 left-0 right-0 z-20 flex items-center justify-center border-t-2 border-red-300 bg-white px-3 py-3 text-center text-sm font-semibold text-zinc-700 shadow-md sm:px-4 sm:text-base"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <p className="max-w-full break-words tracking-wide">
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/shashwat-singh-57220420b/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-red-600 underline hover:text-red-700"
        >
          Shashwat Singh
        </a>
      </p>
    </footer>
  );
}
