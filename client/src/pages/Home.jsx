import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <div className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">Welcome to ArtAura</h1>
              <p className="lead mb-4">
                Discover, buy, sell, and compete with amazing artworks from talented artists around the world.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/marketplace" className="btn btn-light btn-lg">Browse Art</Link>
                <Link to="/competitions" className="btn btn-outline-light btn-lg">Join Competition</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h5 className="card-title">Buy Art</h5>
                <p className="card-text">Discover and purchase unique artworks from talented artists.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h5 className="card-title">Sell Art</h5>
                <p className="card-text">Showcase and sell your creative works to art enthusiasts.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <h5 className="card-title">Compete</h5>
                <p className="card-text">Join art competitions and showcase your talent to the world.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;