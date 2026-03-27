import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { LAB_OPTIONS } from "../config/constants";

export default function WarningsPage() {
  const [lab, setLab] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchWarnings = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/components/warnings", {
          params: {
            lab: lab || undefined,
          },
        });
        if (isMounted) {
          setWarnings(data.warnings || []);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error.response?.data?.message || "Failed to load warnings",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWarnings();
    return () => {
      isMounted = false;
    };
  }, [lab]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Threshold Warnings
        </h2>
        <select
          value={lab}
          onChange={(event) => setLab(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm sm:w-64"
        >
          <option value="">All Labs</option>
          {LAB_OPTIONS.map((labName) => (
            <option key={labName} value={labName}>
              {labName}
            </option>
          ))}
        </select>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm sm:p-5">
        {loading ? (
          <p className="text-sm text-zinc-600">Loading warnings...</p>
        ) : warnings.length === 0 ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            No components are below threshold right now.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed text-left text-sm">
              <thead className="text-zinc-500">
                <tr>
                  <th className="w-[20%] px-2 py-2">Component</th>
                  <th className="w-[16%] px-2 py-2">Model ID</th>
                  <th className="w-[14%] px-2 py-2">Lab</th>
                  <th className="w-[12%] px-2 py-2">Current Qty</th>
                  <th className="w-[12%] px-2 py-2">Total Qty</th>
                  <th className="w-[10%] px-2 py-2">Threshold</th>
                  <th className="w-[16%] px-2 py-2">Below Since</th>
                </tr>
              </thead>
              <tbody>
                {warnings.map((item) => (
                  <tr key={item._id} className="border-t border-zinc-100">
                    <td className="break-words px-2 py-2 whitespace-normal">
                      {item.name}
                    </td>
                    <td className="break-all px-2 py-2 whitespace-normal">
                      {item.componentId}
                    </td>
                    <td className="break-words px-2 py-2 whitespace-normal">
                      {item.lab}
                    </td>
                    <td className="px-2 py-2 font-semibold text-red-700">
                      {item.available}
                    </td>
                    <td className="px-2 py-2">
                      {item.totalStock ?? item.available}
                    </td>
                    <td className="px-2 py-2">{item.threshold}</td>
                    <td className="px-2 py-2">
                      {item.belowThresholdSince
                        ? new Date(item.belowThresholdSince).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
