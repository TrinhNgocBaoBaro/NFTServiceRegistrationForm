import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import NFTBanner3 from "../assets/images/NFTBanner3.png";

const Home = () => { 

    return (
        <div className="container">
      <img
        src={NFTBanner3}
        className="img-fluid mb-4 rounded"
        alt="NFT Capital Group Banner"
        style={{ width: "100%" }}
            />
            </div>
    )
}
export default Home;
