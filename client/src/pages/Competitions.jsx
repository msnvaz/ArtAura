import React from 'react';

function Competitions() {
  return (
    <div className="container py-5">
      <div className="competition-banner text-center py-5 mb-5 rounded">
        <h2 className="display-5 fw-bold mb-3">Art Competitions</h2>
        <p className="lead">
          Showcase your talent, compete with other artists, and win amazing prizes!
        </p>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <h3>Active Competitions</h3>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-primary">Submit Your Art</button>
        </div>
      </div>
      
      <div className="row">
        {/* Sample competition cards */}
        {[
          { title: "Digital Art Challenge", status: "Active", deadline: "15 days left", prize: "$1,000" },
          { title: "Nature Photography", status: "Active", deadline: "8 days left", prize: "$500" },
          { title: "Abstract Painting", status: "Upcoming", deadline: "Starts in 5 days", prize: "$750" },
          { title: "Street Art Contest", status: "Ended", deadline: "Results announced", prize: "$1,200" }
        ].map((comp, index) => (
          <div key={index} className="col-lg-6 mb-4">
            <div className="card competition-card position-relative">
              <span className={`competition-status ${
                comp.status === 'Active' ? 'status-active' : 
                comp.status === 'Upcoming' ? 'status-upcoming' : 'status-ended'
              }`}>
                {comp.status}
              </span>
              <div className="card-img-top bg-gradient d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                <span className="text-white fs-4">{comp.title}</span>
              </div>
              <div className="card-body">
                <h5 className="card-title">{comp.title}</h5>
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted">Deadline:</small>
                    <p className="mb-1">{comp.deadline}</p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Prize:</small>
                    <p className="mb-1 fw-bold text-success">{comp.prize}</p>
                  </div>
                </div>
                <div className="mt-3">
                  {comp.status === 'Active' && (
                    <button className="btn btn-primary me-2">Enter Competition</button>
                  )}
                  {comp.status === 'Upcoming' && (
                    <button className="btn btn-outline-primary me-2">Get Notified</button>
                  )}
                  {comp.status === 'Ended' && (
                    <button className="btn btn-outline-secondary me-2">View Results</button>
                  )}
                  <button className="btn btn-outline-dark">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="row mt-5">
        <div className="col-12 text-center">
          <h4>Ready to showcase your talent?</h4>
          <p className="text-muted mb-4">Join our community of artists and start competing today!</p>
          <button className="btn btn-lg btn-primary">Register Now</button>
        </div>
      </div>
    </div>
  );
}

export default Competitions;