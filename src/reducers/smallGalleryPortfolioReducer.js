/**
* Constants
*/

import * as actionTypes from "../constants/actionTypes";

/**
* Utility
*/

import * as Utility from "../utility";
import uuid from "uuid";

/**
* Initial State
*/

export const initialState = {
    item: {},
    loading: false,
    error: null
}

const fetchSmallGalleryPortfolioBegin = (state, action) => {
    return {
        ...state,
        loading: true,
        error: null
    };
}

const fetchSmallGalleryPortfolioSuccess = (state, action) => {    
    return {
        ...state,
        loading: false,
        item: action.obj
    };
}

const fetchSmallGalleryPortfolioFailur = (state, action) => {
    return {
        ...state,
        loading: false,
        error: action.err,
        item: {}
    };
}

const setSmallGalleryIsHoveringTag = (state, action) => {
    let updatedTags = [...state.item.tags];

    let tag = {...updatedTags.find(item => item.id === action.id), isHover: action.val};
    let tagIndex = updatedTags.findIndex(item => item.id === action.id);
    updatedTags.splice(tagIndex, 1, tag);

    return {
        ...state,
        item: {
            ...state.item,
            tags: updatedTags
        }
    };
}

const smallGallerysPortfolioReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.FETCH_SMALL_GALLERY_PORTFOLIO_BEGIN:
            return fetchSmallGalleryPortfolioBegin (state, action); 
        case actionTypes.FETCH_SMALL_GALLERY_PORTFOLIO_SUCCESS:
            return fetchSmallGalleryPortfolioSuccess (state, action);
        case actionTypes.FETCH_SMALL_GALLERY_PORTFOLIO_FAILURE:
            return fetchSmallGalleryPortfolioFailur(state, action);
        case actionTypes.SET_SMALL_GALLERY_IS_HOVERING_TAG:
            return setSmallGalleryIsHoveringTag(state, action);
        default: 
            return state;
    }
}

export default smallGallerysPortfolioReducer;
