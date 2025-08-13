import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useArt } from '../../context/ArtContext';
import ImageZoomLens from '../../components/artworks/ImageZoomLense';

const ArtworkDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const { artworks } = useArt();
  const navigate = useNavigate();

  const artwork = state?.artwork || artworks.find((a) => a.id === Number(id));

  if (!artwork) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Artwork not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#362625] underline">
          Go Back
        </button>
      </div>
    );
  }

  const { title, description, price, imageUrls } = artwork;

  return (
    <div className="min-h-screen bg-[#faf3e0] p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-[#362625] mb-4">{title}</h1>

        {/* ✅ Zoom-enabled image gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {imageUrls.map((img, index) => (
            <ImageZoomLens
              key={index}
              src={img}
              zoom={7}         // Increased zoom level for better detail
              lensSize={160}   // Increased lens box size for better visibility
            />
          ))}
        </div>

        <p className="text-gray-700 mb-2">{description}</p>
        <p className="text-green-600 text-lg font-semibold">Price: ${price}</p>

        <button onClick={() => navigate(-1)} className="mt-6 text-[#362625] underline">
          ← Back to Gallery
        </button>
      </div>
    </div>
  );
};

export default ArtworkDetail;
