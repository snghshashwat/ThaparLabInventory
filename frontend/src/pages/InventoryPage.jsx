import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { LAB_OPTIONS } from "../config/constants";

const emptyForm = {
  id: "",
  name: "",
  componentId: "",
  available: 0,
  threshold: 5,
  lab: LAB_OPTIONS[0],
};

export default function InventoryPage() {
  const [lab, setLab] = useState(LAB_OPTIONS[0]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadComponents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/components", { params: { lab } });
      setComponents(data.components);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [lab]);

  useEffect(() => {
    loadComponents();
  }, [loadComponents]);

  const beginEdit = (component) => {
    setForm({
      id: component._id,
      name: component.name,
      componentId: component.componentId,
      available: component.available,
      threshold: component.threshold,
      lab: component.lab,
    });
  };

  const cancelEdit = () => {
    setForm(emptyForm);
  };

  const saveEdit = async () => {
    if (!form.id) {
      return;
    }

    setSaving(true);
    try {
      await api.put(`/components/${form.id}`, {
        name: form.name,
        componentId: form.componentId,
        available: Number(form.available),
        threshold: Number(form.threshold),
        lab: form.lab,
      });
      toast.success("Component updated");
      setForm(emptyForm);
      loadComponents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteComponent = async (id) => {
    if (!window.confirm("Delete this component?")) {
      return;
    }

    try {
      await api.delete(`/components/${id}`);
      toast.success("Component deleted");
      loadComponents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-zinc-900">
          Inventory Management
        </h2>
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

      {loading ? (
        <LoadingSpinner label="Loading inventory..." />
      ) : (
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-zinc-500">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Component ID</th>
                  <th className="px-2 py-2">Available</th>
                  <th className="px-2 py-2">Threshold</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {components.map((component) => (
                  <tr key={component._id} className="border-t border-zinc-100">
                    <td className="px-2 py-2 font-medium text-zinc-800">
                      {component.name}
                    </td>
                    <td className="px-2 py-2">{component.componentId}</td>
                    <td className="px-2 py-2">{component.available}</td>
                    <td className="px-2 py-2">{component.threshold}</td>
                    <td className="px-2 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => beginEdit(component)}
                          className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteComponent(component._id)}
                          className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {form.id ? (
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-zinc-900">
            Edit Component
          </h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  name: event.target.value,
                }))
              }
              placeholder="Component Name"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <input
              value={form.componentId}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  componentId: event.target.value.toUpperCase(),
                }))
              }
              placeholder="Component ID"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={form.available}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  available: Number(event.target.value),
                }))
              }
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={form.threshold}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  threshold: Number(event.target.value),
                }))
              }
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            <select
              value={form.lab}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  lab: event.target.value,
                }))
              }
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              {LAB_OPTIONS.map((labName) => (
                <option key={labName} value={labName}>
                  {labName}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={saveEdit}
              disabled={saving}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
