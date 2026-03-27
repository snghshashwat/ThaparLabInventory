import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { LAB_INSTRUCTORS, LAB_OPTIONS } from "../config/constants";

export default function DashboardPage() {
  const [lab, setLab] = useState(LAB_OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    inventory: [],
    recentTransactions: [],
    lowStock: [],
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard", { params: { lab } });
        if (isMounted) {
          setDashboard(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
        }
        toast.error(
          error.response?.data?.message || "Failed to load dashboard",
        );
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [lab]);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  const totalStock = dashboard.inventory.reduce(
    (sum, item) => sum + item.available,
    0,
  );
  const instructor = LAB_INSTRUCTORS[lab];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
        <select
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm md:w-auto"
          value={lab}
          onChange={(event) => setLab(event.target.value)}
        >
          {LAB_OPTIONS.map((labName) => (
            <option key={labName} value={labName}>
              {labName}
            </option>
          ))}
        </select>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm sm:p-5">
        <h3 className="text-base font-semibold text-zinc-900">
          Lab Instructor
        </h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <p className="text-sm text-zinc-700">
            Name:{" "}
            <span className="font-semibold text-zinc-900">
              {instructor?.name || "Not assigned"}
            </span>
          </p>
          <p className="text-sm text-zinc-700">
            Contact:{" "}
            <span className="font-semibold text-zinc-900 break-all">
              {instructor?.contact || "Not available"}
            </span>
          </p>
          <p className="text-sm text-zinc-700">
            Location:{" "}
            <span className="font-semibold text-zinc-900 break-words">
              {instructor?.location || "Not available"}
            </span>
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <StatCard label="Components" value={dashboard.inventory.length} />
        <StatCard
          label="Total Units in Stock"
          value={totalStock}
          tone="accent"
        />
        <StatCard
          label="Low Stock Alerts"
          value={dashboard.lowStock.length}
          tone="danger"
        />
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-semibold text-zinc-900">
          Low Stock Alerts
        </h3>
        {dashboard.lowStock.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">
            No low stock items in this lab.
          </p>
        ) : (
          <>
            <div className="mt-3 space-y-3 sm:hidden">
              {dashboard.lowStock.map((item) => (
                <article
                  key={item._id}
                  className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
                >
                  <p className="text-sm font-semibold text-zinc-900 break-words">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 break-all">
                    ID: {item.componentId}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <p className="rounded-lg bg-red-50 px-2 py-1 text-red-700">
                      Available:{" "}
                      <span className="font-semibold">{item.available}</span>
                    </p>
                    <p className="rounded-lg bg-zinc-100 px-2 py-1 text-zinc-700">
                      Threshold:{" "}
                      <span className="font-semibold">{item.threshold}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-3 hidden overflow-x-auto sm:block">
              <table className="min-w-full table-fixed text-left text-sm">
                <thead className="text-zinc-500">
                  <tr>
                    <th className="w-[44%] px-2 py-2">Component</th>
                    <th className="w-[28%] px-2 py-2">ID</th>
                    <th className="w-[14%] px-2 py-2">Available</th>
                    <th className="w-[14%] px-2 py-2">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.lowStock.map((item) => (
                    <tr key={item._id} className="border-t border-zinc-100">
                      <td className="break-words whitespace-normal px-2 py-2 font-medium text-zinc-800">
                        {item.name}
                      </td>
                      <td className="break-all whitespace-normal px-2 py-2">
                        {item.componentId}
                      </td>
                      <td className="px-2 py-2 text-red-700">
                        {item.available}
                      </td>
                      <td className="px-2 py-2">{item.threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-semibold text-zinc-900">
          Recent Transactions
        </h3>
        <div className="mt-3 space-y-3 sm:hidden">
          {dashboard.recentTransactions.length === 0 ? (
            <p className="text-sm text-zinc-600">No recent transactions.</p>
          ) : (
            dashboard.recentTransactions.map((txn) => (
              <article
                key={txn._id}
                className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-zinc-900 break-all">
                    {txn.studentRoll}
                  </p>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-700">
                    {txn.type}
                  </span>
                </div>
                <p className="mt-2 text-xs text-zinc-600 break-words">
                  {txn.items
                    .map((item) => `${item.name} (${item.qty})`)
                    .join(", ")}
                </p>
                <p className="mt-2 text-xs text-zinc-500 break-all">
                  By: {txn.doneBy}
                </p>
                <p className="mt-1 text-xs text-zinc-500 break-words">
                  {new Date(txn.timestamp).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>

        <div className="mt-3 hidden overflow-x-auto sm:block">
          <table className="min-w-full table-fixed text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="w-[16%] px-2 py-2">Student Roll</th>
                <th className="w-[12%] px-2 py-2">Type</th>
                <th className="w-[34%] px-2 py-2">Items</th>
                <th className="w-[18%] px-2 py-2">Done By</th>
                <th className="w-[20%] px-2 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentTransactions.map((txn) => (
                <tr key={txn._id} className="border-t border-zinc-100">
                  <td className="break-all whitespace-normal px-2 py-2">
                    {txn.studentRoll}
                  </td>
                  <td className="px-2 py-2 capitalize">{txn.type}</td>
                  <td className="break-words whitespace-normal px-2 py-2">
                    {txn.items
                      .map((item) => `${item.name} (${item.qty})`)
                      .join(", ")}
                  </td>
                  <td className="break-all whitespace-normal px-2 py-2">
                    {txn.doneBy}
                  </td>
                  <td className="break-words whitespace-normal px-2 py-2">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
