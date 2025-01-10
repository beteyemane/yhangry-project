import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSetMenus } from '../redux/actions/setMenusActions';
import SetMenuCard from './SetMenuCard';
import Filters from './Filters';

const SetMenusPage = () => {
    const dispatch = useDispatch();
    const { setMenus, cuisines, pagination, loading, error } = useSelector((state) => state.setMenus);
    const [cuisineSlug, setCuisineSlug] = useState(null);
    const [guests, setGuests] = useState(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchSetMenus(cuisineSlug, page, 10, guests));
    }, [cuisineSlug, page, guests, dispatch]);

    const handleGuestsChange = (e) => setGuests(e.target.value);
    const handleCuisineFilter = (slug) => setCuisineSlug(slug);
    const loadMore = () => setPage((prevPage) => prevPage + 1);

    return (
        <div className="set-menus-page">
            <h1>Set Menus</h1>

            <div className="filters">
                <Filters cuisines={cuisines} onFilter={handleCuisineFilter} />
                <input
                    type="number"
                    value={guests}
                    onChange={handleGuestsChange}
                    min="1"
                    placeholder="Guests"
                />
            </div>

            <div className="menus">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {setMenus.map((menu) => (
                    <SetMenuCard key={menu.id} menu={menu} />
                ))}
            </div>

            {pagination.page < Math.ceil(pagination.total / pagination.limit) && (
                <button onClick={loadMore}>Show More</button>
            )}
        </div>
    );
};

export default SetMenusPage;
