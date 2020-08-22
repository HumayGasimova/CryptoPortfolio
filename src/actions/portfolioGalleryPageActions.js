import * as actionTypes from '../constants/actionTypes';

export function fetchPortfolioGalleryPageBegin() {
    return { 
        type: actionTypes.FETCH_PORTFOLIO_GALLERY_PAGE_BEGIN
    };
};

export function fetchPortfolioGalleryPageSuccess(array) {
    return { 
        type: actionTypes.FETCH_PORTFOLIO_GALLERY_PAGE_SUCCESS,
        array: array
    };
};

export function fetchPortfolioGalleryPageFailur(err) {
    return { 
        type: actionTypes.FETCH_PORTFOLIO_GALLERY_PAGE_FAILURE,
        err: err
    };
};


export function rememberCoordinateRangeForPortfolioGalleryPage(id, coordinateRange) {
    return { 
        type: actionTypes.REMEMBER_COORDINATE_RANGE_FOR_PORTFOLIO_GALLERY_PAGE,
        id: id,
        coordinateRange: coordinateRange
    };
};

export function forgetCoordinateRangeForPortfolioGalleryPage(arr) {
    return { 
        type: actionTypes.FORGET_COORDINATE_RANGE_FOR_PORTFOLIO_GALLERY_PAGE,
        arr: arr
    };
};

export function setPortfolioGalleryPageIsHoveringTypeOfCard(val, id) {
    return { 
        type: actionTypes.SET_PORTFOLIO_GALLERY_PAGE_IS_HOVERING_TYPE_OF_CARD,
        val: val,
        id: id
    };
};
