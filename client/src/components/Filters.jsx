import React from 'react';

const Filters = ({ cuisines, onFilter, total, selectedCuisine}) => (
    <div className="cuisines-filters">
        <p className="sub-title">Filters:</p>
        <button className={`button ${!selectedCuisine ? 'selected' : ''}`} onClick={() => onFilter(null)}>All ({total})</button>
        {cuisines.map((cuisine) => (
            <button className={`button ${selectedCuisine === cuisine.slug ? 'selected' : ''}`} key={cuisine.id} onClick={() => onFilter(cuisine.slug)}>
                {cuisine.name} ({cuisine.set_menus_count})
            </button>
        ))}
    </div>
);

export default Filters;
