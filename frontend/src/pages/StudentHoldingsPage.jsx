import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import BarcodeScanner from "../components/BarcodeScanner";
import api from "../lib/api";

export default function StudentHoldingsPage() {
  const [studentRoll, setStudentRoll] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const totalLabs = useMemo(() => result?.labs?.length || 0, [result]);

  const handleScan = (value) => {
    setStudentRoll(String(value).replace(/\s+/g, ""));
    setScannerOpen(false);
    toast.success("ID card scanned");
  };

  const fetchHoldings = async () => {
    const roll = studentRoll.trim();

    if (!roll) {
      toast.error("Enter or scan a roll number");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(
        `/transactions/student/${encodeURIComponent(roll)}/holdings`,
      );
      setResult(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch holdings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        Student Holdings
      </h2>

      <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm sm:p-5">
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Roll Number
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={studentRoll}
            onChange={(event) => setStudentRoll(event.target.value)}
            placeholder="e.g. 102203123"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => setScannerOpen((open) => !open)}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 sm:min-w-[132px]"
          >
            {scannerOpen ? "Close Scanner" : "Scan ID Card"}
          </button>
          <button
            type="button"
            onClick={fetchHoldings}
            disabled={loading}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Loading..." : "Check Holdings"}
          </button>
        </div>

        {scannerOpen ? (
          <div className="mt-3">
            <BarcodeScanner
              inline
              onDetected={handleScan}
              onClose={() => setScannerOpen(false)}
            />
          </div>
        ) : null}
      </section>

      {result ? (
        <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600">
              Roll:{" "}
              <span className="font-semibold text-zinc-900">
                {result.studentRoll}
              </span>
            </p>
            <p className="text-sm text-zinc-600">
              Total Items Out:{" "}
              <span className="font-semibold text-zinc-900">
                {result.totalItems}
              </span>
            </p>
          </div>

          {totalLabs === 0 ? (
            <p className="text-sm text-zinc-600">
              No outstanding items for this student.
            </p>
          ) : (
            <div className="space-y-4">
              {result.labs.map((labSummary) => (
                <div
                  key={labSummary.lab}
                  className="rounded-xl border border-zinc-200 p-3"
                >
                  <h3 className="mb-2 text-base font-semibold text-zinc-900">
                    {labSummary.lab}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-fixed text-left text-sm">
                      <thead className="text-zinc-500">
                        <tr>
                          <th className="w-[54%] px-2 py-2">Component</th>
                          <th className="w-[28%] px-2 py-2">ID</th>
                          <th className="w-[18%] px-2 py-2">Qty Out</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labSummary.items.map((item) => (
                          <tr
                            key={`${labSummary.lab}-${item.componentId}`}
                            className="border-t border-zinc-100"
                          >
                            <td className="break-words px-2 py-2 whitespace-normal">
                              {item.name}
                            </td>
                            <td className="break-all px-2 py-2 whitespace-normal">
                              {item.componentId}
                            </td>
                            <td className="px-2 py-2 font-semibold text-red-700">
                              {item.qty}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
