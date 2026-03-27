import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import BarcodeScanner from "../components/BarcodeScanner";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../lib/api";
import { LAB_OPTIONS } from "../config/constants";

export default function TransactionsPage() {
  const [lab, setLab] = useState(LAB_OPTIONS[0]);
  const [mode, setMode] = useState("take");
  const [studentRoll, setStudentRoll] = useState("");
  const [components, setComponents] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const fetchComponents = useCallback(async () => {
    try {
      const { data } = await api.get("/components", { params: { lab } });
      setComponents(data.components);
      if (data.components.length > 0) {
        setSelectedComponentId(
          (current) => current || data.components[0].componentId,
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load components");
    } finally {
      setLoading(false);
    }
  }, [lab]);

  useEffect(() => {
    setLoading(true);
    setCart([]);
    fetchComponents();
  }, [fetchComponents]);

  const selectedComponent = useMemo(
    () =>
      components.find(
        (component) => component.componentId === selectedComponentId,
      ),
    [components, selectedComponentId],
  );

  const handleBarcodeDetected = (rawValue) => {
    setStudentRoll(String(rawValue).replace(/\s+/g, ""));
    setScannerOpen(false);
    toast.success("ID card scanned");
  };

  const addToCart = () => {
    if (!selectedComponent) {
      toast.error("Select a component");
      return;
    }

    const amount = Number(qty);
    if (!Number.isFinite(amount) || amount < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (mode === "take" && amount > selectedComponent.available) {
      toast.error("Requested quantity exceeds available stock");
      return;
    }

    setCart((previous) => {
      const existing = previous.find(
        (item) => item.componentId === selectedComponent.componentId,
      );
      if (existing) {
        return previous.map((item) =>
          item.componentId === selectedComponent.componentId
            ? { ...item, qty: item.qty + amount }
            : item,
        );
      }

      return [
        ...previous,
        {
          componentId: selectedComponent.componentId,
          name: selectedComponent.name,
          qty: amount,
        },
      ];
    });

    setQty(1);
  };

  const removeFromCart = (componentId) => {
    setCart((previous) =>
      previous.filter((item) => item.componentId !== componentId),
    );
  };

  const submitTransaction = async () => {
    if (!studentRoll.trim()) {
      toast.error("Student roll is required");
      return;
    }

    if (cart.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/transactions", {
        studentRoll: studentRoll.trim(),
        type: mode,
        lab,
        items: cart,
      });

      toast.success("Transaction saved");
      setCart([]);
      await fetchComponents();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit transaction",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading transaction form..." />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-900">Take / Return</h2>

      <div className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Lab
          </label>
          <select
            value={lab}
            onChange={(event) => setLab(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {LAB_OPTIONS.map((labName) => (
              <option key={labName} value={labName}>
                {labName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Mode
          </label>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="take">Take</option>
            <option value="return">Return</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Student Roll Number
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={studentRoll}
              onChange={(event) => setStudentRoll(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              placeholder="e.g. 102203123"
            />
            <button
              type="button"
              onClick={() => setScannerOpen((open) => !open)}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 sm:w-auto"
            >
              {scannerOpen ? "Close Scanner" : "Scan ID Card"}
            </button>
          </div>
          {scannerOpen ? (
            <div className="mt-3">
              <BarcodeScanner
                inline
                onDetected={handleBarcodeDetected}
                onClose={() => setScannerOpen(false)}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-[1fr_120px_auto]">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Component
          </label>
          <select
            value={selectedComponentId}
            onChange={(event) => setSelectedComponentId(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {components.map((component) => (
              <option key={component._id} value={component.componentId}>
                {component.name} ({component.componentId}) - Available:{" "}
                {component.available}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Qty
          </label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(event) => setQty(Number(event.target.value))}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={addToCart}
            className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white"
          >
            Add Item
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-zinc-900">Cart</h3>
        {cart.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600">No items added yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-zinc-500">
                <tr>
                  <th className="px-2 py-2">Component</th>
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Qty</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr
                    key={item.componentId}
                    className="border-t border-zinc-100"
                  >
                    <td className="px-2 py-2">{item.name}</td>
                    <td className="px-2 py-2">{item.componentId}</td>
                    <td className="px-2 py-2">{item.qty}</td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.componentId)}
                        className="text-sm font-medium text-red-600"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="button"
          onClick={submitTransaction}
          disabled={submitting}
          className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto"
        >
          {submitting ? "Submitting..." : "Submit Transaction"}
        </button>
      </section>
    </div>
  );
}
