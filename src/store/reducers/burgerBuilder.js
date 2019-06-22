import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

const initialState = {
    ingredients: null,
    totalPrice: 4, // the base price,
    error: false
}

const burgerBuilder = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            const updatedIngredient = {[action.ingName]: state.ingredients[action.ingName] + 1};
            const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
            const updatedState = {
                ingredients: updatedIngredients,
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingName]
            };
            return updateObject(state, updatedState);
        case actionTypes.REMOVE_INGREDIENT:
            const updatedIng = {[action.ingName]: state.ingredients[action.ingName] - 1};
            const updatedIngs = updateObject(state.ingredients, updatedIng);
            const updatedStateObj = {
                ingredients: updatedIngs,
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingName]
            };
            return updateObject(state, updatedStateObj);
        case actionTypes.SET_INGREDIENTS:
            return updateObject(state, {
                ingredients: {
                    salad: action.ingredients.salad,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat,
                },
                price: 4,
                error: false
            });
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return updateObject(state, { error: true });
        default:
            return state;
    }
};

export default burgerBuilder;
