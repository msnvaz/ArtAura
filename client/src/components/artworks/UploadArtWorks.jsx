import { useState } from 'react';

const UploadArtwork = ({ onUpload }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    imageFiles: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'imageFiles') {
      setFormData((prev) => ({
        ...prev,
        imageFiles: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const readers = formData.imageFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((imageUrls) => {
      const newArtwork = {
        id: Date.now(),
        title: formData.title,
        price: formData.price,
        description: formData.description,
        imageUrls, // store all image dataURLs
      };

      onUpload(newArtwork);
      setFormData({
        title: '',
        price: '',
        description: '',
        imageFiles: [],
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-[#362625]">Upload New Artwork</h2>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border px-4 py-2 rounded"
        required
      />

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price ($)"
        className="w-full border px-4 py-2 rounded"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border px-4 py-2 rounded"
      />

      <input
        type="file"
        name="imageFiles"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="w-full"
        required
      />

      <button type="submit" className="bg-[#362625] text-white py-2 px-4 rounded hover:bg-[#2c1f1f]">
        Upload Artwork
      </button>
    </form>
  );
};

export default UploadArtwork;
