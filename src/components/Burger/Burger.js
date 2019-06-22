import React from 'react';
import classes from './Burger.less';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(ingredientKey => {
            //Array(2) will create an array with 2 empty elements.
            return [...Array(props.ingredients[ingredientKey])].map((_, i) => {
                return <BurgerIngredient key={ingredientKey + i} type={ingredientKey}/>
            })
        })
        .reduce((arr, el) => {
            return [...arr, el];
        }, []);
    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;

