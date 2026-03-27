import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { LAB_OPTIONS } from "../config/constants";

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">Dashboard</h2>
        <select
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
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

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-zinc-900">
          Low Stock Alerts
        </h3>
        {dashboard.lowStock.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">
            No low stock items in this lab.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-zinc-500">
                <tr>
                  <th className="px-2 py-2">Component</th>
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Available</th>
                  <th className="px-2 py-2">Threshold</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.lowStock.map((item) => (
                  <tr key={item._id} className="border-t border-zinc-100">
                    <td className="px-2 py-2 font-medium text-zinc-800">
                      {item.name}
                    </td>
                    <td className="px-2 py-2">{item.componentId}</td>
                    <td className="px-2 py-2 text-red-700">{item.available}</td>
                    <td className="px-2 py-2">{item.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-zinc-900">
          Recent Transactions
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="px-2 py-2">Student Roll</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Items</th>
                <th className="px-2 py-2">Done By</th>
                <th className="px-2 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentTransactions.map((txn) => (
                <tr key={txn._id} className="border-t border-zinc-100">
                  <td className="px-2 py-2">{txn.studentRoll}</td>
                  <td className="px-2 py-2 capitalize">{txn.type}</td>
                  <td className="px-2 py-2">
                    {txn.items
                      .map((item) => `${item.name} (${item.qty})`)
                      .join(", ")}
                  </td>
                  <td className="px-2 py-2">{txn.doneBy}</td>
                  <td className="px-2 py-2">
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
