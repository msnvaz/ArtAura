import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function CreateChallenge() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !publishDate || !deadline) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(deadline) <= new Date(publishDate)) {
      alert('Deadline must be after the Publish Date!');
      return;
    }

    alert(
      `Challenge Created!\n` +
      `Title: ${title}\n` +
      `Publish Date: ${publishDate}\n` +
      `Deadline: ${deadline}\n` +
      `Description: ${description}`
    );

    // Reset form
    setTitle('');
    setPublishDate('');
    setDeadline('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-cream/20 py-12 flex justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-brown mb-4 flex items-center gap-2">
          <Plus className="h-6 w-6" />
          Create New Challenge
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full border border-cream rounded p-3 focus:outline-none"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

  <div>
    <label className="block text-brown/70 mb-1">Publish Date</label>
    <input
      type="date"
      className="w-full border border-cream rounded p-3 focus:outline-none"
      value={publishDate}
      onChange={(e) => setPublishDate(e.target.value)}
    />
  </div>

  <div>
    <label className="block text-brown/70 mb-1">Deadline</label>
      <input
        type="date"
        className="w-full border border-cream rounded p-3 focus:outline-none"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
    />
  </div>

          <textarea
            className="w-full border border-cream rounded p-3 focus:outline-none"
            placeholder="Description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="bg-black text-white font-bold px-6 py-2 rounded-full hover:bg-black/90 transition-colors"
          >
            Create Challenge
          </button>
        </form>

        <p className="text-center text-brown/50 mt-6">
          Fill out all fields to launch your new challenge.
        </p>
      </div>
    </div>
  );
}

