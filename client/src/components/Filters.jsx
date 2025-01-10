import React from 'react';

const Filters = ({ cuisines, onFilter }) => (
    <div className="cuisines-filters">
        <button onClick={() => onFilter(null)}>All</button>
        {cuisines.map((cuisine) => (
            <button key={cuisine.id} onClick={() => onFilter(cuisine.slug)}>
                {cuisine.name} ({cuisine.set_menus_count})
            </button>
        ))}
    </div>
);

export default Filters;
