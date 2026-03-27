import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { LAB_OPTIONS } from "../config/constants";

export default function LogsPage() {
  const [lab, setLab] = useState("");
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/transactions", {
          params: {
            lab: lab || undefined,
            limit: 100,
          },
        });
        if (isMounted) {
          setLogs(data.transactions || []);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.response?.data?.message || "Failed to load logs");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLogs();
    return () => {
      isMounted = false;
    };
  }, [lab]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Logs
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
        <p className="mb-3 text-sm text-zinc-600">
          Complete activity history{lab ? ` for ${lab}` : " across all labs"}.
        </p>

        {loading ? (
          <p className="text-sm text-zinc-600">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-zinc-600">No logs found.</p>
        ) : (
          <>
            <div className="space-y-3 sm:hidden">
              {logs.map((log) => (
                <article
                  key={log._id}
                  className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-zinc-900 break-all">
                      {log.studentRoll}
                    </p>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-700">
                      {log.type}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-600 break-words">
                    Lab:{" "}
                    <span className="font-medium text-zinc-800">{log.lab}</span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-600 break-words">
                    {log.items
                      .map((item) => `${item.name} (${item.qty})`)
                      .join(", ")}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500 break-all">
                    By: {log.doneBy}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 break-words">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="min-w-full table-fixed text-left text-sm">
                <thead className="text-zinc-500">
                  <tr>
                    <th className="w-[14%] px-2 py-2">Roll</th>
                    <th className="w-[8%] px-2 py-2">Type</th>
                    <th className="w-[14%] px-2 py-2">Lab</th>
                    <th className="w-[28%] px-2 py-2">Items</th>
                    <th className="w-[20%] px-2 py-2">Done By</th>
                    <th className="w-[16%] px-2 py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-t border-zinc-100">
                      <td className="break-all px-2 py-2 whitespace-normal">
                        {log.studentRoll}
                      </td>
                      <td className="px-2 py-2 capitalize">{log.type}</td>
                      <td className="break-words px-2 py-2 whitespace-normal">
                        {log.lab}
                      </td>
                      <td className="break-words px-2 py-2 whitespace-normal">
                        {log.items
                          .map((item) => `${item.name} (${item.qty})`)
                          .join(", ")}
                      </td>
                      <td className="break-all px-2 py-2 whitespace-normal">
                        {log.doneBy}
                      </td>
                      <td className="break-words whitespace-normal px-2 py-2">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
