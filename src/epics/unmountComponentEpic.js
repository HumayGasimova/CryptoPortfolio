/**
* Operators
*/

import { 
    of
} from 'rxjs';

import { 
    mergeMap, 
    delay 
  } from 'rxjs/operators';

import { 
    ofType 
} from 'redux-observable';

/**
* Constants
*/

import * as actionTypes from '../constants/actionTypes';
import * as Actions from '../actions';

/**
* Epic
*/

export const unmountComponentEpic = (action$) => 
    action$.pipe(
        ofType(actionTypes.UNMOUNT_COMPONENT),
        mergeMap(action => {
            return of(
                Actions.gotoNewPage()
            ).pipe(
                delay(1000)
            )
        })
    )

export default unmountComponentEpic;