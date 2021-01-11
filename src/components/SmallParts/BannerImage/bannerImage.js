/**
 * Libraries
 */

import React, {
    useState, 
    useEffect,
    useRef
} from 'react';

/**
 * Styles
 */

import './bannerImage.scss';

/**
 * Utility
 */

import { 
    H35,
    EH20,
    EH180
} from '../../UtilityComponents';

/**
 * Images
 */

import * as Images from '../../../constants/images';

/**
 * BannerImage component definition and export
 */

export const BannerImage = (props) => {

    /**
     * State
     */

    const resizeRef = useRef();
    const [isHovering, setIsHovering] = useState("init");
    const [cardHeight, setCardHeight] = useState(0);
 
    /**
     * Methods
     */

    useEffect(() => {
        // Event Listeners

        const resize = () => {
            resizeRef.current();
        }

        window.addEventListener('resize', resize);

        // Cleaning the unmounted component
        return () =>  window.removeEventListener('resize', resize);
    }, []);

    useEffect(() => {
        resizeRef.current = handleResize;
    })

    const handleResize = () => {
        // Set the height of the curtain and padding value on window resize

        let cardHeight = document.getElementById("img").clientHeight;
        setCardHeight(cardHeight);
    }

    const handleMouseEnter = (opt) => {
        switch(opt){
            case 'curtain': 
                setIsHovering("on");
                handleResize();
            break;
        }
    }

    const handleMouseLeave = (opt) => {
        switch(opt){
            case 'curtain': 
                setIsHovering("off");
                break;
        }
    }

    const loadImg = (key) => {
        switch(key) {
            case 'bannerPageCover1':
                return Images.BANNER_PAGE_COVER_1;
            case 'bannerPageCover2':
                return Images.BANNER_PAGE_COVER_2;
            case 'bannerPageCover3':
                return Images.BANNER_PAGE_COVER_3;
            default:
                return "";
        }
    }

    const renderClassName = (opt, isHovering) => {
        if(opt === "curtain"){
            switch(isHovering){
                case 'init':
                    return "display-none";
                case 'on':
                    return "banner-curtain-hover-on";
                case 'off':
                    return "banner-curtain-hover-off"
            }
        }
        if(opt === "bannerImage"){
            switch(isHovering){
                case 'init':
                    return "banner-image";
                case 'on':
                    return "banner-image-hover-on";
                case 'off':
                    return "banner-image-hover-off"
            }
        }
        if(opt === "bannerHeader"){
            switch(isHovering){
                case 'init':
                    return "banner-header";
                case 'on':
                    return "banner-header-hover-on";
                case 'off':
                    return "banner-header-hover-off"
            }
        }
        if(opt === "arrow"){
            switch(isHovering){
                case 'init':
                    return "display-none";
                case 'on':
                    return "banner-image-arrow-wrapper-lengthen";
                case 'off':
                    return "banner-image-arrow-wrapper-shorten"
            }
        }
    }

    const bannerImageOnClick = (e, path) => {
        // Do nothing on right mouse click

        if(e.button === 2) return;

        // Storing data in local storage 

        localStorage.setItem("page", props.page);
        
        if(e.button !== 1){

            // If template page do nothing on left mouse click 

            if(['bannerPageSection1'].includes(props.page)) return;

            /**
             * Add fading effect on the unmounted component and remember 
             * information of the unmounted component on left mouse click 
             */

            props.setUnmountComponentValues(true, path);
        }else{
            if(['bannerPageSection1'].includes(props.page)){
                // Open the template page on scroll wheel click 

                props.setUnmountComponentValues(false, props.currentPagePathName);
            }else{
                // Remember information of the unmounted component on scroll wheel click 

                props.setUnmountComponentValues(false, path);
            }
        }
        // Fire up unmountComponent epic

        props.unmountComponent(null, null,  props.page, e.button);
    }

    /**
     * Markup
     */

    return(
        <div 
            className="banner-image"
            onMouseEnter={() => handleMouseEnter("curtain", null, isHovering)} 
            onMouseLeave={() => handleMouseLeave("curtain", null, isHovering)}
        >
            <div className={renderClassName("bannerImage", isHovering)}>
                <img 
                    id="img"
                    src={loadImg(props.obj.coverImage.key)} 
                    alt={props.obj.coverImage.alt}
                />
            </div>
            <div
                className={renderClassName("bannerHeader", isHovering)}
                onMouseDown={(e) => bannerImageOnClick(e, props.obj.path)}
            >
                <H35 className="h35-white-poppins">{props.obj.header}</H35>
                <EH20/>
            </div>
            <div 
                className={renderClassName("curtain", isHovering)}
                style={{height: `${cardHeight}px`}}
               
            >
                <EH180/>
                <div className={renderClassName("arrow", isHovering)}>
                    <div className="arrow-horizontal-line"/>
                    <div className="arrow-wrapper2">
                        <div className="arrow-top-line"></div>
                        <div className="arrow-bottom-line"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BannerImage;
