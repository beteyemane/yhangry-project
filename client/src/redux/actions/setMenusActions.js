import axios from 'axios';

export const FETCH_SET_MENUS_REQUEST = 'FETCH_SET_MENUS_REQUEST';
export const FETCH_SET_MENUS_SUCCESS = 'FETCH_SET_MENUS_SUCCESS';
export const FETCH_SET_MENUS_FAILURE = 'FETCH_SET_MENUS_FAILURE';

export const fetchSetMenus = (cuisineSlug, page, limit, guests) => async (dispatch) => {
    dispatch({ type: FETCH_SET_MENUS_REQUEST });

    try {
        const response = await axios.get(`${process.env.REACT_APP_API_SET_MENUS_URL}?cuisineSlug=${cuisineSlug || ''}&page=${page}&limit=${limit}`);
        const { setMenus, cuisines, pagination } = response.data;
        console.log('response', response)
        // calculate the total prices
        const updatedMenus = setMenus.map((menu) => ({
            ...menu,
            totalPrice: Math.max(menu.price_per_person * guests),
        }));

        dispatch({
            type: FETCH_SET_MENUS_SUCCESS,
            payload: { setMenus: updatedMenus, cuisines, pagination },
        });
    } catch (error) {
        dispatch({ type: FETCH_SET_MENUS_FAILURE, payload: error.message });
    }
};
