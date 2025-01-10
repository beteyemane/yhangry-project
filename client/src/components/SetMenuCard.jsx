import React from 'react';

const SetMenuCard = ({ menu }) => (
    <div className="set-menu-card">
        <img src={menu.image} alt={menu.name} />
        <h3>{menu.name}</h3>
        <p>{menu.description}</p>
        <p>{menu.totalPrice}</p>
    </div>
);

export default SetMenuCard;
