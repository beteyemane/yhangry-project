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
        dispatch(fetchSetMenus(cuisineSlug, page, 10));
    }, [cuisineSlug, page, dispatch]);

    const handleGuestsChange = (e) => setGuests(e.target.value);
    const handleCuisineFilter = (slug) => setCuisineSlug(slug);
    const loadMore = () => setPage((prevPage) => prevPage + 1);
    const handleIncrement = () => {
        setGuests((prevCount) => prevCount + 1);
    };
    const handleDecrement = () => {
        setGuests((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));
    };

    return (
        <div className="set-menus-page">
            <h1 className="title">Set Menus</h1>

            <div className="filters">
                <div className="guests-container">
                    <div className="button-guests-container">
                        <button className='guests-button decrement' type="button" onClick={handleDecrement} disabled={guests <= 1}>
                        -
                        </button>
                        <input
                        className="guests-input"
                        type="number"
                        value={guests}
                        onChange={handleGuestsChange}
                        min="1"
                        placeholder="Guests"
                        />
                        <button className='guests-button increment' type="button" onClick={handleIncrement}>
                        +
                        </button>
                     </div>
                    <p>Guests</p>
                </div>
            <Filters cuisines={cuisines} onFilter={handleCuisineFilter} total={pagination.total} selectedCuisine={cuisineSlug}/>
            </div>

            <div className="menus">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                {setMenus.map((menu) => {
                    const totalPrice = Math.max(menu.price_per_person * guests);
                    return <SetMenuCard key={menu.id} menu={{ ...menu, totalPrice }} />;
                })}
            </div>

            {pagination.page < Math.ceil(pagination.total / pagination.limit) && (
                <button className="button load-more" onClick={loadMore}>Load more</button>
            )}
        </div>
    );
};

export default SetMenusPage;
