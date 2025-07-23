import { useNavigate } from 'react-router-dom';
import { formatLKR } from '../../util/currency';

const ArtGallery = ({ artworks }) => {
  const navigate = useNavigate();

  if (artworks.length === 0) {
    return <p className="text-gray-500 text-center mt-6">No artworks uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {artworks.map((art) => (
        <div
          key={art.id}
          className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          onClick={() => navigate(`/artworks/${art.id}`, { state: { artwork: art } })} // ✅ Pass data via state
        >
          <img src={art.imageUrls?.[0]} alt={art.title} className="w-full h-60 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-[#362625]">{art.title}</h3>
            <span className="text-md font-bold text-green-600">{formatLKR(art.price)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtGallery;

