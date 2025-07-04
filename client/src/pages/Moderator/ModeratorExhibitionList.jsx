import { CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

// Dummy data for demonstration. Replace with API call in production.
const dummyExhibitions = [
  {
    id: 1,
    title: 'Modern Art Expo',
    location: 'Gallery One',
    createdBy: 'Alice',
    feePaid: '$100',
    status: 'Pending'
  },
  {
    id: 2,
    title: 'Nature Wonders',
    location: 'Art Hall',
    createdBy: 'Bob',
    feePaid: '$120',
    status: 'Pending'
  }
];

const ModeratorExhibitionList = () => {
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    // Replace with API call to fetch pending exhibitions
    setExhibitions(dummyExhibitions);
  }, []);

  const handleApprove = (id) => {
    setExhibitions(exhibitions =>
      exhibitions.map(exh =>
        exh.id === id ? { ...exh, status: 'Verified' } : exh
      )
    );
    // Call API to update status if needed
  };

  const handleReject = (id) => {
    setExhibitions(exhibitions =>
      exhibitions.map(exh =>
        exh.id === id ? { ...exh, status: 'Rejected' } : exh
      )
    );
    // Call API to update status if needed
  };

  const pendingCount = exhibitions.filter(e => e.status === 'Pending').length;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-amber-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-amber-900">
          Pending Exhibitions
          <span className="ml-2 bg-amber-700 text-white px-2 py-1 rounded text-sm">{pendingCount}</span>
        </h2>
      </div>
      <ul className="space-y-4">
        {exhibitions.map(exh => (
          <li key={exh.id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between border border-amber-200">
            <div>
              <div className="font-semibold text-amber-900">{exh.title}</div>
              <div className="text-sm text-gray-500">{exh.location} | {exh.createdBy}</div>
              <div className="flex items-center gap-2 mt-1 text-amber-800">
                <DollarSign size={16} /> Fee Paid: <span className="font-medium">{exh.feePaid}</span>
              </div>
              <div className="mt-1">
                <span className={`text-xs px-2 py-1 rounded ${exh.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : exh.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {exh.status}
                </span>
              </div>
            </div>
            {exh.status === 'Pending' && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  className="flex items-center gap-1 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                  onClick={() => handleApprove(exh.id)}
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button
                  className="flex items-center gap-1 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                  onClick={() => handleReject(exh.id)}
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            )}
          </li>
        ))}
        {pendingCount === 0 && (
          <li className="text-gray-500 text-center py-8">No pending exhibitions.</li>
        )}
      </ul>
    </div>
  );
};

export default ModeratorExhibitionList;
