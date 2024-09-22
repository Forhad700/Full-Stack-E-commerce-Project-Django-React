export const initialstate = {
    profile: null,
    pagereload: null,
    carts: null,
    cartcomplit: null,
    cartuncomplit: null
}

const reducer = (state, action) => {
    console.log(action.type);
    switch (action.type) {
        case "ADD_PROFILE":
            return {
                ...state,
                profile: action.profile,
            };
            case "PAGE_RELOAD":
            return {
                ...state,
                pagereload: action.pagereload
            }
        case "ADD_CART":
            return {
                ...state,
                carts: action.carts,
            }
        case "ADD_CARTCOMPLIT":
            return {
                ...state,
                cartcomplit: action.cartcomplit
            }
        case "ADD_CARTUNCOMPLIT":
            return {
                ...state,
                cartuncomplit: action.cartuncomplit
            }
        default:
            return state;
    }
};

export default reducer;