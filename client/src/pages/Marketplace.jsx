import React from 'react';

function Marketplace() {
  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-center mb-4">Art Marketplace</h2>
          <p className="text-center text-muted">
            Browse and purchase amazing artworks from our community of artists
          </p>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6 col-lg-4 mb-3">
          <select className="form-select">
            <option>All Categories</option>
            <option>Digital Art</option>
            <option>Paintings</option>
            <option>Photography</option>
            <option>Sculptures</option>
          </select>
        </div>
        <div className="col-md-6 col-lg-4 mb-3">
          <select className="form-select">
            <option>Price: All</option>
            <option>Under $100</option>
            <option>$100 - $500</option>
            <option>$500 - $1000</option>
            <option>Over $1000</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search artworks..."
          />
        </div>
      </div>
      
      <div className="row">
        {/* Sample art cards */}
        {[1, 2, 3, 4, 5, 6].map(item => (
          <div key={item} className="col-lg-4 col-md-6 mb-4">
            <div className="card art-card">
              <div className="card-img-top bg-light d-flex align-items-center justify-content-center" style={{height: '250px'}}>
                <span className="text-muted">Art Image {item}</span>
              </div>
              <div className="card-body">
                <h5 className="card-title">Artwork Title {item}</h5>
                <p className="card-text text-muted">By Artist Name</p>
                <div className="d-flex justify-content-between align-items-center">
                  <strong className="text-primary">${(Math.random() * 500 + 50).toFixed(0)}</strong>
                  <button className="btn btn-outline-primary btn-sm">View Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;