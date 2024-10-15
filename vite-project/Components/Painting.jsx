import React from "react";

const Painting = ({ image, title, venue, people, last_update, onDiscover, onBan }) => {
    return (
      <div className="card">
        <h2 className="name">{title}</h2>
        
        <div className="attribute-container">
          <button onClick={() => onBan(venue)}>{venue}</button>
          <button onClick={() => onBan(people)}>{people}</button>
          <button onClick={() => onBan(last_update)}>{last_update}</button>
        </div>
        
        <img 
          src={image} 
          alt={`${title}`} 
          className="image"
        />
        
        <button className="discover-button" onClick={onDiscover}>
          🔍 Discover!
        </button>
      </div>
    );
  }


export default Painting;