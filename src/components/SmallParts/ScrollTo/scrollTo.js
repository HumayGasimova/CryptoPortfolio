/**
 * Libraries
 */

import React, {
    useEffect
} from 'react';

import { withRouter } from "react-router-dom";

export const ScrollToTop = (props) => {
    /**
     * Methods
     */

    useEffect(() => {
        console.log("props.scrollToPosition",props.scrollToPosition)
        window.scrollTo(0, props.scrollToPosition);
        debugger
    }, [props.location]);

    /**
     * Markup
     */

    return(
        <React.Fragment /> 
    );
}

export default withRouter(ScrollToTop)