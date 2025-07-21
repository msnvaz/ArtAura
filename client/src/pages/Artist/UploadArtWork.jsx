import { useArt } from '../../context/ArtContext';
import UploadArtwork from '../../components/artworks/UploadArtWorks';
import ArtGallery from '../../components/artworks/ArtGallery';

const ArtistDashboard = () => {
  const { artworks, uploadArtwork } = useArt();

  return (
    <div className="min-h-screen bg-[#faf3e0] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#362625] mb-6">Artist Dashboard</h1>
        <UploadArtwork onUpload={uploadArtwork} />
        <ArtGallery artworks={artworks} />
      </div>
    </div>
  );
};

export default ArtistDashboard;
