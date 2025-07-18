import React, { useState } from "react";
import {
  X,
  Trophy,
  Star,
  Medal,
  Award,
  Save,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

const initialForm = {
  title: "",
  type: "winner",
  date: "",
  prize: "",
};

const typeOptions = [
  { value: "winner", label: "Winner", icon: <Trophy className="h-5 w-5" /> },
  { value: "featured", label: "Featured", icon: <Star className="h-5 w-5" /> },
  {
    value: "runner-up",
    label: "Runner-up",
    icon: <Medal className="h-5 w-5" />,
  },
  { value: "special", label: "Special", icon: <Award className="h-5 w-5" /> },
];

const ManageAchievementsModal = ({
  isOpen,
  onClose,
  achievements = [],
  onSave,
}) => {
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [localAchievements, setLocalAchievements] = useState(achievements);

  React.useEffect(() => {
    setLocalAchievements(achievements);
  }, [achievements]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!form.title || !form.date || !form.prize) return;
    setLocalAchievements((prev) => [...prev, { ...form, id: Date.now() }]);
    setForm(initialForm);
  };

  const handleEdit = (ach) => {
    setForm(ach);
    setEditingId(ach.id);
  };

  const handleUpdate = () => {
    setLocalAchievements((prev) =>
      prev.map((a) => (a.id === editingId ? { ...form, id: editingId } : a))
    );
    setForm(initialForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setLocalAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveAll = () => {
    if (onSave) onSave(localAchievements);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold text-[#7f5539] mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6" /> Manage Achievements
        </h2>
        {/* Form */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border rounded px-3 py-2 text-[#7f5539] focus:outline-none focus:ring"
          />
          <div className="flex gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange("type", opt.value)}
                className={`flex items-center gap-1 px-3 py-2 rounded border ${
                  form.type === opt.value
                    ? "bg-[#7f5539] text-white"
                    : "bg-gray-100 text-[#7f5539]"
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full border rounded px-3 py-2 text-[#7f5539] focus:outline-none focus:ring"
          />
          <input
            type="text"
            placeholder="Prize / Recognition"
            value={form.prize}
            onChange={(e) => handleChange("prize", e.target.value)}
            className="w-full border rounded px-3 py-2 text-[#7f5539] focus:outline-none focus:ring"
          />
          <div className="flex gap-2">
            {editingId ? (
              <button
                onClick={handleUpdate}
                className="bg-[#7f5539] text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Update
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="bg-[#7f5539] text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            )}
            <button
              onClick={() => {
                setForm(initialForm);
                setEditingId(null);
              }}
              className="bg-gray-200 text-[#7f5539] px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
        </div>
        {/* List */}
        <div className="mb-6 max-h-56 overflow-y-auto">
          {localAchievements.length === 0 && (
            <div className="text-[#7f5539]/60 text-center">
              No achievements yet.
            </div>
          )}
          {localAchievements.map((ach) => (
            <div
              key={ach.id}
              className="flex items-center justify-between p-3 border-b last:border-b-0"
            >
              <div className="flex items-center gap-3">
                {typeOptions.find((t) => t.value === ach.type)?.icon}
                <div>
                  <div className="font-medium text-[#7f5539]">{ach.title}</div>
                  <div className="text-xs text-[#7f5539]/60">
                    {ach.prize} • {ach.date}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(ach)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(ach.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveAll}
          className="w-full bg-[#7f5539] text-white py-2 rounded font-semibold flex items-center justify-center gap-2"
        >
          <Save className="h-5 w-5" /> Save All
        </button>
      </div>
    </div>
  );
};

export default ManageAchievementsModal;
