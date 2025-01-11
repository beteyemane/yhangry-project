import React from 'react';
import CuisineTag from './CuisineTag';

const SetMenuCard = ({ menu }) => (
    <div className="menu-card">
        <img src={menu.image} alt={menu.name} loading="lazy" />
        {menu.cuisines.map(cuisine => (
            <CuisineTag key={cuisine.id} name={cuisine.name}/>
        ))}
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-description">{menu.description}</p>
        <p className="menu-price">£{menu.totalPrice}</p>
    </div>
);

export default SetMenuCard;
