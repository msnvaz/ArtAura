import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdf5e6' }}>
      {/* Main content - simplified for better dashboard rendering */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;