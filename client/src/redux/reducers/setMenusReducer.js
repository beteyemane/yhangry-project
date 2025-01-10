import {
    FETCH_SET_MENUS_REQUEST,
    FETCH_SET_MENUS_SUCCESS,
    FETCH_SET_MENUS_FAILURE,
} from '../actions/setMenusActions';

const initialState = {
    loading: false,
    setMenus: [],
    cuisines: [],
    pagination: {},
    error: null,
};

const setMenusReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SET_MENUS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_SET_MENUS_SUCCESS:
            return {
                ...state,
                loading: false,
                setMenus: action.payload.setMenus,
                cuisines: action.payload.cuisines,
                pagination: action.payload.pagination,
            };
        case FETCH_SET_MENUS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default setMenusReducer;
