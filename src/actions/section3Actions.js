import * as actionTypes from '../constants/actionTypes';

export function fetchTestimonialsBegin() {
    return { 
        type: actionTypes.FETCH_TESTIMONIALS_BEGIN
    };
};

export function fetchTestimonialsSuccess(array) {
    return { 
        type: actionTypes.FETCH_TESTIMONIALS_SUCCESS,
        array: array
    };
};

export function fetchTestimonialsFailur(err) {
    return { 
        type: actionTypes.FETCH_TESTIMONIALS_FAILURE,
        err: err
    };
};

export function fetchTeamInformationBegin() {
    return { 
        type: actionTypes.FETCH_TEAM_INFORMATION_BEGIN
    };
};

export function fetchTeamInformationSuccess(array) {
    return { 
        type: actionTypes.FETCH_TEAM_INFORMATION_SUCCESS,
        array: array
    };
};

export function fetchTeamInformationFailur(err) {
    return { 
        type: actionTypes.FETCH_TEAM_INFORMATION_FAILURE,
        err: err
    };
};

