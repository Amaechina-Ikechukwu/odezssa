const initialState = {
  currentProducts: null,
};

export const products = (state = initialState, action) => {
  return {
    ...state,
    currentProducts: action.currentProducts,
  };
};
