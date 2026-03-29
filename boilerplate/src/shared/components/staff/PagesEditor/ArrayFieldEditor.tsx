"use client";

interface ArrayFieldEditorProps {
  fieldName: string;
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
}

export function ArrayFieldEditor({ fieldName, items, onChange }: ArrayFieldEditorProps) {
  function handleItemChange(index: number, key: string, value: unknown) {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  }

  function addItem() {
    // Clone first item as template (empty values)
    const template = items[0]
      ? Object.fromEntries(Object.keys(items[0]).map((k) => [k, ""]))
      : {};
    onChange([...items, template]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  const formatLabel = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()).trim();

  return (
    <div className="border border-brand-border/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-bold text-brand-dark/70 uppercase tracking-wide">
          {formatLabel(fieldName)} ({items.length} items)
        </label>
        <button
          type="button"
          onClick={addItem}
          className="text-xs text-brand-accent font-semibold hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="bg-brand-bg/50 rounded-lg p-3 relative">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              title="Hapus item"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(item).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-[11px] text-brand-dark/50 mb-0.5">
                    {formatLabel(key)}
                  </label>
                  {typeof value === "string" && value.length > 80 ? (
                    <textarea
                      value={value as string}
                      onChange={(e) => handleItemChange(index, key, e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1.5 border border-brand-border rounded text-xs bg-white focus:ring-1 focus:ring-brand-accent/20 outline-none resize-y"
                    />
                  ) : typeof value === "number" ? (
                    <input
                      type="number"
                      value={value as number}
                      onChange={(e) => handleItemChange(index, key, Number(e.target.value))}
                      className="w-full px-2 py-1.5 border border-brand-border rounded text-xs bg-white focus:ring-1 focus:ring-brand-accent/20 outline-none"
                    />
                  ) : typeof value === "boolean" ? (
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={(e) => handleItemChange(index, key, e.target.checked)}
                      className="w-4 h-4"
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(value ?? "")}
                      onChange={(e) => handleItemChange(index, key, e.target.value)}
                      className="w-full px-2 py-1.5 border border-brand-border rounded text-xs bg-white focus:ring-1 focus:ring-brand-accent/20 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
