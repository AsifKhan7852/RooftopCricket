import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Registered_Book_Rooftop.css";
import arrow from "../Images/arrow.png";
import search from "../Images/search.png";
import Register_Navbar from "./Register_Navbar";

export default function Registered_Book_Rooftop({ ngrok_url }) {
  const [rooftops, setRooftops] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();

  const fetchRooftops = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${ngrok_url}/api/Rooftop/fetchRooftopWithFilters`, {
        headers: {
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        responseType: "json",
        params: {
          pricePerHour: selectedPrice || undefined,
          city: selectedCity || undefined,
          rooftopName: searchQuery || undefined,
        },
      });

      if (Array.isArray(response.data)) {
        setRooftops(response.data);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      console.error("Error fetching rooftops:", err);
      setError("Failed to load rooftops. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooftops();
  }, [selectedPrice, selectedCity]);

  return (
    <div className="register_book_rooftop_scroll">
    <Register_Navbar bc="#3E8989"/>
      <div className="register_book_rooftop">
        <div className="register_book_rooftop_head">
          <h4 data-text="Available Rooftops">Available Rooftops</h4>
          <div className="register_book_search_main">
            <input
              className="register_book_input"
              type="text"
              placeholder="Search Rooftop by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchRooftops()}
            />
            <div className="register_book_search_img" onClick={fetchRooftops}>
              <img src={search} alt="Search" />
            </div>
          </div>
        </div>

        <div className="register_book_user">
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="register_book_user_drop"
          >
            <option value="">All Prices</option>
            <option value="2000">2000</option>
            <option value="2200">2200</option>
            <option value="3000">3000</option>
          </select>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="register_book_user_drop"
          >
            <option value="">All Cities</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
          </select>
        </div>

        {error && <p className="error_message">{error}</p>}

        {loading ? (
          <div className="loading-animation">
            <div className="loading-spinner">
              <div className="spinner-sector spinner-sector-top"></div>
              <div className="spinner-sector spinner-sector-left"></div>
              <div className="spinner-sector spinner-sector-right"></div>
            </div>
            <p>Loading rooftops...</p>
          </div>
        ) : (
          <div className="register_book_rooftop_body">
            {rooftops.length > 0 ? (
              rooftops.map((rooftop) => (
                <div 
                  key={rooftop.rooftopId} 
                  className="slot_card"
                  onMouseEnter={() => setHoveredCard(rooftop.rooftopId)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="slot_card_image_container">
                    <div className="image-overlay"></div>
                    <img
                      src={encodeURI(`${ngrok_url}${rooftop.images[0]}`)}
                      alt={rooftop.rooftopName}
                      className="slot_card_image"
                    />
                  </div>
                  <div className="slot_card_data">
                    <h5>Name</h5>
                    <p>{rooftop.rooftopName}</p>
                  </div>
                  <div className="slot_card_data">
                    <h5>Price</h5>
                    <p>{rooftop.pricePerHour} PKR</p>
                  </div>
                  <div className="slot_card_data">
                    <h5>City</h5>
                    <p>{rooftop.location}</p>
                  </div>
                  <div className="slot_card_data">
                    <h5>Available Time</h5>
                    <p>{rooftop.startTime} - {rooftop.endTime}</p>
                  </div>
                  <div className="slot_card_data">
                    <h5>Address</h5>
                    <p>{rooftop.address}</p>
                  </div>
                  <div className="explore_btn">
                    <button
                      onClick={() => {
                        localStorage.setItem("RooftopId", JSON.stringify(rooftop.rooftopId));
                        localStorage.setItem("RooftopPrice", rooftop.pricePerHour.toString());
                        navigate(`/rooftop_available_slots`);
                      }}
                    >
                      <span className="button-text">Explore Slots</span>
                      <span className="button-icon">→</span>
                    </button>
                  </div>
                  <div className="card-border"></div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <svg className="no-results-icon" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13V9H11V7M11,11H13V17H11V11Z" />
                </svg>
                <p>No rooftops available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}