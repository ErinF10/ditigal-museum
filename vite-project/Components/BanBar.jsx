import React from "react";

const BanBar = ({ bannedAttributes, onUnban }) => {
    return (
        <div className="ban-bar">
            <h3>Banned Attributes:</h3>
            {bannedAttributes.map((attr, index) => (
                <button key={index} onClick={() => onUnban(attr)}>
                    {attr} ❌
                </button>
            ))}
        </div>
    );
}

export default BanBar;