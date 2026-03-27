export default function Footer({ user }) {
  return (
    <footer className="sticky bottom-0 left-0 right-0 z-20 flex items-center justify-center border-t-2 border-red-300 bg-white px-4 py-3 text-xs text-zinc-600 shadow-md">
      <p>
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/shashwat-singh-57220420b/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-red-600 hover:text-red-700 underline"
        >
          Shashwat Singh
        </a>
      </p>
    </footer>
  );
}
