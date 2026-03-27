export default function Footer({ user }) {
  return (
    <footer className="sticky bottom-0 left-0 right-0 z-20 flex items-center justify-center border-t-2 border-red-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 shadow-md sm:text-base">
      <p className="tracking-wide">
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
