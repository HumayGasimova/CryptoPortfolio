/**
 * Libraries
 */

import React, {
    useState,
    useEffect
} from 'react';

import {
    bindActionCreators
} from 'redux';

import {
    connect
} from 'react-redux';

/**
 * Styles
 */

import './contactFormPage.scss';

/**
 * Components
 */

import Loading from '../../../SmallParts/Loading/loading';
import Toolbar from '../../../Parts/Toolbar/toolbar';
import Button from '../../../../library/Button/button';
import Input from '../../../../library/Input/input';
import Footer from '../../../Parts/Footer/footer';
import BackToTop from '../../../SmallParts/BackToTop/backToTop';

/**
 * Actions
 */

import * as Actions from '../../../../actions';

/**
 * Services
 */

import * as Services from "../../../../service";

/**
 * Selectors
 */

import * as Selectors from '../../../../reducers/selectors';

/**
 * Utility
 */

import { 
    H15,
    H45,
    EW20,
    EH20
} from '../../../UtilityComponents';

/**
 * Constants
 */

 import {
    getContactFormPageSection1InputForm
 } from '../../../../constants/inputForm';
/**
 * Hooks
 */

import {
    useWindowSize
} from '../../../../Hooks/useWindowSize';

/**
 * ContactFormPage component definition and export
 */

export const ContactFormPage = (props) => {

    /**
     * State
     */

    const size = useWindowSize();
    const [scrollingUp, setScrollingUp] = useState(false);
    
    /**
     * Methods
     */

    useEffect(() => {
        // Init state for fading effect when component will unmount

        props.setUnmountComponentValues(false, "");
        

        // Init imput forms

        props.initInputForm("section1", getContactFormPageSection1InputForm);

        // Scroll to the top of the screen

        window.scrollTo(0, 0);

        // Event Listeners

        window.addEventListener('wheel', handleOnWheel);

        return () => {
            // Cleaning the unmounted component

            window.removeEventListener('wheel', handleOnWheel);
            props.setMenuDotsState("init", "");
            props.setShowBackToTopComponent(false);
        }
    }, []);

    const handleOnWheel = (e) => {
        let scrollHeight = document.body.scrollTop;
        let el = document.getElementById("contactFormPage");

        // Show or hide BackToTop component

        if(scrollHeight > screen.height/2){
            props.setShowBackToTopComponent(true);
        }else{
            props.setShowBackToTopComponent(false);
        }
    
        // Check scroll direction

        if(!checkScrollDirectionIsUp(e) || scrollHeight < el.offsetTop + 150){
            setScrollingUp(false);
        }else{
            setScrollingUp(true);
        }
    }

    const checkScrollDirectionIsUp = (e)  => {
        if (e.wheelDelta) {
          return e.wheelDelta > 0;
        }
        return e.deltaY < 0;
    }

    const renderToolbars = () => {
        if(size.width < 1120){
            return(
                <>
                    <Toolbar 
                        style="smallScreenAnimated" 
                        scrollingUp={scrollingUp}
                        toolbarMainColor="white"
                        page="contactFormPage"
                    />
                    <Toolbar 
                        style="smallScreen"
                        toolbarMainColor="regular"
                        page="contactFormPage"
                    />
                </>
            )
        }else{
            return(
                <>
                    <Toolbar 
                        style="regularScreenAnimated" 
                        scrollingUp={scrollingUp}
                        toolbarMainColor="white"
                        page="contactFormPage"
                    />
                    <Toolbar 
                        style="regularScreenWhite"
                        toolbarMainColor="white"
                        page="contactFormPage"
                    />
                </>
            )
        }
    }

    // const onClickHandler = () => {
    //     props.sendComment();
    //     if(props.getInTouchInputForm.formIsValid){
    //         clearInputValue("inputGetInTouch1");
    //         clearInputValue("inputGetInTouch2");
    //         clearInputValue("inputGetInTouch3");
    //         clearInputValue("inputGetInTouch4");
    //         clearInputValue("inputGetInTouch5");
    //         clearInputValue("inputGetInTouch6");
    //         clearInputValue("textareaGetInTouch7");
    //     }
    //     props.getInTouchInputForm.inputsArray.map(el => {
    //         if(!el.validField){
    //             clearInputValue(el.inputID);
    //         }
    //     })
    // }

    const inputChangeHandler = (e, inputFieldId) => {
        // props.setInputFiledValueAndCheckValidation(props.getInTouchInputForm, e, inputFieldId, 'getInTouchInputForm');
    }

    // const clearInputValue = (fieldId) => {
    //     document.getElementById(fieldId).value = '';
    // }


    const renderContactFormPageSection1DataContent = () => {
        if(props.contactFormPage.section1InputForm.inputsArray){
            return(
                <div className="contact-form-page-section-1-data">
                    <div className="contact-form-page-section-1-data-inputs-wrapper">
                        {props.contactFormPage.section1InputForm.inputsArray.map((el, i)=>{
                            return(
                                <div 
                                    key={i} 
                                    className="contact-form-page-section-1-form"
                                    style={{
                                        width: `calc(50% - ${i%2 === 0 ? 20 : 0}px)`,
                                        marginRight: `${i%2 === 0 ? 20 : 0}px`
                                    }}
                                >
                                    <Input
                                        className="contact-form-page-section-1-input"
                                        onChange={(event) => inputChangeHandler(event, el.id)}
                                        elementType={el.elementType}
                                        rows={el.elementConfig.rows}
                                        validField={el.validField}
                                        touched={el.touched}
                                        erroeMessages={el.errorMessage}
                                        inputID={el.inputID}
                                        textareaID={el.textareaID}
                                        placeholder={el.elementConfig.placeholder}
                                        options={el.elementConfig.options}
                                    />
                                    <EH20/>
                                </div>
                            )
                        })}
                    </div>
                    <Button
                        className="call-to-action-get-direction-black"
                        text="get direction."
                        // disabled={props.twoColumnsPage.disableLoadMoreButton}
                    />

                </div>
            )
        }
    } 
    
    const renderContactFormPageSection2DataContent = () => {
        return(
            <div className="contact-form-page-section-2-data">

            </div>
        )
    }

    const renderContactFormPageSection3DataContent = () => {
        return(
            <div className="contact-form-page-section-3-data">

            </div>
        )
    } 

    /**
     * Markup
     */

    return(
        <div className="contact-form-page" id="contactFormPage">
            {renderToolbars()}
            <div className="contact-form-page-wrapper">
                <div className="contact-form-page-header">
                    <H45 className="h45-nero-lustria">Contact Form</H45>
                </div>
                <div className="grey-line"/>
                {renderContactFormPageSection1DataContent()}
                {renderContactFormPageSection2DataContent()}
                {renderContactFormPageSection3DataContent()}
            </div>
            <Footer/>
            {props.showBackToTop ? <BackToTop/> : null}
        </div>   
    );
}

export default connect(
    (state) => {
        return {
            contactFormPage: Selectors.getContactFormPageState(state),
            menuDotsState: Selectors.getMenuDotsStateState(state),
            showBackToTop: Selectors.getShowBackToTopState(state),
        };
    },
    (dispatch) => {
        return {
            setUnmountComponentValues: bindActionCreators(Actions.setUnmountComponentValues, dispatch),
            unmountComponent: bindActionCreators(Actions.unmountComponent, dispatch),
            setMenuDotsState: bindActionCreators(Actions.setMenuDotsState, dispatch),
            setShowBackToTopComponent: bindActionCreators(Actions.setShowBackToTopComponent, dispatch),
            initInputForm: bindActionCreators(Actions.initInputForm, dispatch),
        };
    }
)(ContactFormPage);
 