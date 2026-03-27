import { useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { LAB_OPTIONS } from "../config/constants";

const initialForm = {
  name: "",
  componentId: "",
  available: 0,
  totalStock: 0,
  threshold: 5,
  lab: LAB_OPTIONS[0],
};

export default function AddComponentPage() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await api.post("/components", {
        name: form.name,
        componentId: form.componentId.toUpperCase(),
        available: Number(form.available),
        totalStock: Number(form.totalStock),
        threshold: Number(form.threshold),
        lab: form.lab,
      });

      toast.success("Component added");
      setForm(initialForm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add component");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-900">Add New Component</h2>
      <form
        onSubmit={submit}
        className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 md:grid-cols-2"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Component Name
          </label>
          <p className="mb-1 text-xs text-zinc-500">
            Full descriptive name visible in inventory and logs.
          </p>
          <input
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Model ID
          </label>
          <p className="mb-1 text-xs text-zinc-500">
            Unique model/code used for issue-return tracking.
          </p>
          <input
            required
            value={form.componentId}
            onChange={(event) =>
              updateField("componentId", event.target.value.toUpperCase())
            }
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Available Stock
          </label>
          <p className="mb-1 text-xs text-zinc-500">
            Quantity currently available to issue right now.
          </p>
          <input
            required
            type="number"
            min="0"
            value={form.available}
            onChange={(event) =>
              updateField("available", Number(event.target.value))
            }
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Total Stock
          </label>
          <p className="mb-1 text-xs text-zinc-500">
            Total quantity owned by the lab for this component.
          </p>
          <input
            required
            type="number"
            min="0"
            value={form.totalStock}
            onChange={(event) =>
              updateField("totalStock", Number(event.target.value))
            }
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Low Stock Threshold
          </label>
          <p className="mb-1 text-xs text-zinc-500">
            Warning level when available stock reaches this number.
          </p>
          <input
            required
            type="number"
            min="0"
            value={form.threshold}
            onChange={(event) =>
              updateField("threshold", Number(event.target.value))
            }
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Lab
          </label>
          <p className="mb-1 text-xs text-zinc-500">
            Select the lab where this component will be maintained.
          </p>
          <select
            value={form.lab}
            onChange={(event) => updateField("lab", event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {LAB_OPTIONS.map((labName) => (
              <option key={labName} value={labName}>
                {labName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            disabled={saving}
            type="submit"
            className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Add Component"}
          </button>
        </div>
      </form>
    </div>
  );
}
