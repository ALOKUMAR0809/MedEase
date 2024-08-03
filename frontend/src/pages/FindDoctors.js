import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../config'

const FindDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/doctors`)
      .then((response) => response.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value || '');
  };

  const handleSearch = () => {
    setSearched(true);
    const filteredDoctors = doctors.filter((doctor) => {
      const searchQueryLowerCase = (searchQuery || '').toLowerCase();
      const doctorNameLowerCase = (doctor.name || '').toLowerCase();
      const doctorSpecialtyLowerCase = (doctor.speciality || '').toLowerCase();
      return (
        doctorNameLowerCase.includes(searchQueryLowerCase) ||
        doctorSpecialtyLowerCase.includes(searchQueryLowerCase)
      );
    });
    setSearchResults(filteredDoctors);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearched(false);
  };

  return (
    <div className="container mx-auto">
      <div className='findDoctorSearch d-flex justify-content-center align-items-center'>
        <div className='overlay d-flex flex-column justify-content-center align-items-center p-2'>
          <h1 className="mb-4 "><span className='text-white'>Find</span> <span style={{ color: '#0aac71' }}>Doctors</span></h1>
          <h6 className="mb-4">Search Doctor by name or speciality</h6>
          <div className="input-group find-search mb-3 search-bar">
          <input className="form-control" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={handleSearchQueryChange}/>
          <button className="btn me-2" type="submit" onClick={handleSearch}><FontAwesomeIcon className="text-white" icon={faMagnifyingGlass} /></button>
            <div className="input-group-append">
              {searchQuery && (
                <button className="btn btn-secondary mx-2" type="button" onClick={handleClearSearch}>Clear</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {searchResults.length === 0 && searched ? (<p className='text-center p-3'>No doctors found.</p>) : (
        <div className="row mt-4">
          {searchResults.map((doctor) => (
            <div key={doctor.id} className="col-md-3 mb-4">
              <div className="card">
              <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={doctor.profileImage} className="card-img-top doctor-img" alt={doctor.name} style={{ objectFit: 'cover' ,width: '100%', height: '100%' }}/>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{doctor.name}</h5>
                  <p className="card-text mb-1 muted">{doctor.speciality}</p>
                  <p className=" mb-4" style={{ color: doctor.isAvailable === "Available"? "green": doctor.isAvailable === "Not Available"? "red": "blue"}}>{doctor.isAvailable}</p>
                  <Link to={`/doctors/${doctor._id}`} className="btn text-white mt-2" style={{ backgroundColor: "#61677A" }}>Check Profile</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctorsPage;
