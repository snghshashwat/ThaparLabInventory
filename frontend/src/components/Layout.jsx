import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../config/constants";
import { useAuth } from "../context/AuthContext";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = NAV_ITEMS.filter((item) =>
    user?.role === "admin" ? true : !item.adminOnly,
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/college-campus.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "blur(2px) brightness(0.9)",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 border-b-2 border-red-600 bg-white px-3 py-2 shadow-md sm:px-4 sm:py-3 md:px-8 md:flex-nowrap">
          <div className="flex min-w-fit items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="text-lg leading-none">☰</span>
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 flex-shrink-0 sm:h-12 sm:w-12">
              <span className="text-base font-bold text-white sm:text-lg">
                ti
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-600 leading-none">
                Thapar Institute
              </p>
              <p className="text-xs font-bold text-red-700 sm:text-sm leading-none">
                Lab Inventory
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden text-right md:block">
              <p className="text-xs sm:text-sm font-semibold text-red-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs uppercase tracking-wide text-red-600 truncate">
                {user?.role}
              </p>
            </div>
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="h-8 w-8 rounded-full border-2 border-red-600 flex-shrink-0 sm:h-10 sm:w-10"
              />
            ) : (
              <div className="h-8 w-8 rounded-full border-2 border-red-600 bg-red-100 flex-shrink-0 sm:h-10 sm:w-10" />
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-red-700 flex-shrink-0 sm:px-3 sm:py-2"
            >
              Logout
            </button>
          </div>
        </header>

        {mobileMenuOpen ? (
          <div className="border-b border-red-200 bg-white px-3 py-2 shadow-sm md:hidden">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-red-600">
              Navigation
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      "block rounded-lg px-3 py-2 text-sm font-medium transition",
                      isActive || location.pathname === item.path
                        ? "bg-red-600 text-white"
                        : "text-red-900 hover:bg-red-50",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}

        <div className="mx-auto w-full max-w-7xl px-3 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <aside className="hidden md:block md:w-60 md:flex-shrink-0">
              <div className="sticky top-24 rounded-2xl border-2 border-red-300 bg-white p-3 shadow-md">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-red-600">
                  Navigation
                </p>
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        [
                          "block rounded-lg px-3 py-2 text-sm font-medium transition",
                          isActive || location.pathname === item.path
                            ? "bg-red-600 text-white"
                            : "text-red-900 hover:bg-red-50",
                        ].join(" ")
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="min-w-0 flex-1 rounded-2xl border-2 border-red-300 bg-white p-4 shadow-md md:p-6 mb-20">
              {children}
            </main>
          </div>
        </div>
      </div>
      <Footer user={user} />
    </div>
  );
}
