/**
 * Libraries
 */

import React, {
    useState,
    useEffect,
    useRef
} from 'react';

import {
    connect
} from 'react-redux';

import {
    bindActionCreators
} from 'redux';

import { 
    FontAwesomeIcon 
} from '@fortawesome/react-fontawesome';

/**
 * Styles
 */

import './swiper.scss';

/**
 * Components
 */

import Loading from '../../components/SmallParts/Loading/loading';
import PhotoViewer from '../../components/Parts/PhotoViewer/photoViewer';

/**
 * Actions
 */

import * as Actions from '../../actions';

/**
 * Selectors
 */

import * as Selectors from '../../reducers/selectors';


/**
 * Utility
 */

import {
    H19,
    H25,
    H45,
    EH25,
} from '../../components/UtilityComponents';


/**
 * Hooks
 */

import {
    useInterval
} from '../../Hooks/useInterval';

/**
 * Images
 */

import * as Images from '../../constants/images';

/**
 * Icons
 */

import { 
    faChevronUp,
    faChevronDown
 } from '@fortawesome/free-solid-svg-icons';

/**
 * Swiper component definition and export
 */

export const Swiper = (props) => {

    const testimonialsContent = useRef();
    const bigSliderContent = useRef();
    const smallSliderContent  = useRef();
    const testimonialsPageSection1Content = useRef();
    const testimonialsPageSection2Content = useRef();
    const testimonialsPageSection3Content = useRef();
    const [currentSwiper, setCurrentSwiper] = useState('');
    const [relode, setRelode] = useState(false)

    const getHeight = () => window.innerHeight;
    const getWidth = () => window.innerWidth;
    
    // const [slides, setSlides] = useState([])
    const [isHoveringLeftArrow, setIsHoveringLeftArrow] = useState("init");
    const [isHoveringRightArrow, setIsHoveringRightArrow] = useState("init");
    // const [mouseDown, setMouseDown] = useState(false)
  
    // const []

    // const [state, setState] = useState({
    //     activeIndex: 0,
    //     translate: 0,
    //     transition: 0.45,
    //     _slides: []
    // });

    // const {activeIndex, translate, transition, _slides} = state;

    const transitionRef = useRef();
    const resizeRef = useRef();

    /**
     * Methods
     */

    useEffect(() => {
        let slidesArray = [...props.contentArray];
        let _slides;
        let swiperWrapper;
        let swiperContent;
        let translateVal;
        let _updatedSlides;
        if(!props.content.loading && props.showNumbersOfSlides === 1){
            swiperWrapper = document.getElementById(`swiper-wrapper-${props.component}`);   
            swiperContent = document.getElementById(`swiper-content-${props.component}`);
       
            _slides = [slidesArray[slidesArray.length - 1], slidesArray[0], slidesArray[1]];
            // setState({
            //     ...state,
            //     _slides: [slidesArray[slidesArray.length - 1], slidesArray[0], slidesArray[1]],
            //     translate: getTranslateValue(props.translateWidth, props.translateHeight),
            // })

            if(props.swiperData.rerender) {
                props.setSwiperState(props.swiperData.slides, props.swiperData._slides, props.swiperData.activeIndex, props.swiperData.translate, props.swiperData.transition, true);

                translateVal =  getTranslateValue(props.translateWidth, props.translateHeight);
                _updatedSlides = updateSlidesFullScreen(props.swiperData.slides, props.swiperData.activeIndex);
            }else{
                props.setSwiperState(slidesArray, _slides, 0, getTranslateValue(props.translateWidth, props.translateHeight), 0.45, false);
                translateVal =  getTranslateValue(props.translateWidth, props.translateHeight);
            }
            slide(swiperWrapper, swiperContent, translateVal, _updatedSlides);

            // Calculate swiper content coordinates 

            if(!props.content.itemsCoordinateRange.updated && props.swiperData.slides.length !== 0){
                setTabCoordinateRange("init");
              
            }
        }

        if(!props.content.loading && props.showNumbersOfSlides === 3){
            _slides = [slidesArray[slidesArray.length - 1], slidesArray[0], slidesArray[1]]
            // setState({
            //     ...state,
            //     _slides: [slidesArray[slidesArray.length - 1], slidesArray[0], slidesArray[1]],
            //     translate: getTranslateValue(props.translateWidth, props.translateHeight),
            // })
            prop.setSwiperState(slidesArray, _slides, 0, getTranslateValue(props.translateWidth, props.translateHeight), 0.45, props.swiperData.rerender);
        }
 
        if(props.content.itemsCoordinateRange.updated){
            window.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
           
            props.setSwiperState([], [], 0, getTranslateValue(props.translateWidth, props.translateHeight), 0.45, false);
            if(swiperContent){
                swiperContent.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mouseup', handleMouseUp)
            }
            if(props.content.itemsCoordinateRange.updated){
                window.removeEventListener('mousemove', handleMouseMove);
            }
            // setState({
            //     activeIndex: 0,
            //     translate: getTranslateValue(props.translateWidth, props.translateHeight),
            //     transition: 0.45,
            //     _slides: []
            // });
            // setSlides([]);
        };
    }, [props.content.loading, 
        props.swiperData.slides.length, 
        props.swiperData.activeIndex, 
        props.content.itemsCoordinateRange.updated]);

    useEffect(() => {
        transitionRef.current = smoothTransition;
        resizeRef.current = handleResize;
    })

    useEffect(() => {
        if(props.swiperData.transition === 0) {
            // setState({
            //     ...state,
            //     transition: 0.45
            // })
           
            props.setSwiperState(props.swiperData.slides, props.swiperData._slides, props.swiperData.activeIndex, props.swiperData.translate, 0.45, props.swiperData.rerender);
        }
    }, [props.swiperData.transition])

    useEffect(() => {

        const smooth = e => {
            if(e.target.className.includes(`${props.translateWidth ? "swiper-window-width-content" : "swiper-window-height-content"}`)){
                transitionRef.current()
            }
        }

        const resize = () => {
            resizeRef.current();
        }

        let interval = null;

        window.addEventListener('transitionend', smooth);
        window.addEventListener('resize', resize);
      
        return () => {
            window.removeEventListener('transitionend', smooth);
            window.removeEventListener('resize', resize);
        };
    }, [])

    useInterval(() => {
        nextSlide();
    },props.autoPlay ? 7000 : null)

    const slide = (swiperWrapper, swiperContent, translateVal, _slides) => {
        let posX1 = 0;
        let posX2 = 0;
        let posInitial;
        let posFinal;
        let threshold = 50; //draging delta
        let direction = 0;

        swiperContent.addEventListener('mousedown', (e) => handleMouseDown(e, dragStart, swiperContent));
        document.addEventListener('mouseup', () => handleMouseUp(swiperContent));

        function dragStart (e) {
            e = e || window.event;
            e.preventDefault();
            posInitial = swiperContent.offsetLeft;
            if (e.type == 'touchstart') {
              posX1 = e.touches[0].clientX;
            } else {
              posX1 = e.clientX;
              document.onmouseup = dragEnd;
              document.onmousemove = dragAction;
            }
        }

        function dragAction (e) {
            e = e || window.event;
            if (e.type == 'touchmove') {
              posX2 = posX1 - e.touches[0].clientX;
              posX1 = e.touches[0].clientX;
            } else {
              posX2 = posX1 - e.clientX;
              posX1 = e.clientX;
            }
            direction = e.movementX;
            swiperContent.style.transition = (swiperContent.offsetLeft - posX2) + "px";
        }
        
        function dragEnd (e) {
            // posFinal = swiperContent.offsetLeft;
            if(['bigSlider', 'smallSlider'].includes(props.component) && direction === 0){
                console.log(props.component)
                openPhotoViewer(props.component, props.swiperData.activeIndex);
            }else if(direction > 0){
                prevSlide(_slides);
            }else if(direction < 0){
                nextSlide(_slides, translateVal);
            }
            // if (posFinal - posInitial < -threshold) {
            //     nextSlide(_slides, translateVal);
            // } else if (posFinal - posInitial > threshold) {
            //     prevSlide(_slides);
            // } 
            // else {
                // swiperContent.style.left = (posInitial) + "px";
            // }
            direction = 0;
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    const handleMouseMove = (e) => {
        /**
         * Check if the coordinates of the cursor are inside which tab,
         * and move the underline under the corresponding tab.
         */
        
        let pageX = e.pageX;
        let pageY = e.pageY;
        
        if(props.content.itemsCoordinateRange.leftCoordinate < pageX && pageX < props.content.itemsCoordinateRange.rightCoordinate && 
            props.content.itemsCoordinateRange.topCoordinate < pageY && pageY < props.content.itemsCoordinateRange.bottomCoordinate){
                setCurrentSwiper(props.content.itemsCoordinateRange.key);
                // console.log("key", props.content.itemsCoordinateRange.key)
        }else{
            setCurrentSwiper('');
        }
    }

    const handleMouseDown = (e, dragStart, swiperContent) => {
        dragStart(e);
        swiperContent.classList.add('active');
    }

    const handleMouseUp = (swiperContent) => {
        swiperContent.classList.remove('active');
    }

    const getTranslateValue = (width, height) => {
        if(width){
            if(width === "windowWidth"){
                return getWidth();
            }else{
                return width;
            }
        }
        if(height){
            if(height === "windowHeight"){
                return getHeight();
            }else{
                return height;
            }
        }
    }
    
    const handleResize = () => {
        // setState({
        //     ...state,
        //     translate: getTranslateValue(props.translateWidth, props.translateHeight),
        //     transition: 0
        // })
        setTabCoordinateRange("onResize");
        props.setSwiperState(props.swiperData.slides, props.swiperData._slides, props.swiperData.activeIndex, getTranslateValue(props.translateWidth, props.translateHeight), 0, true);
        console.log(relode)
        setRelode(!relode)
    }

    const setTabCoordinateRange = (opt) => {
        // Remember swiper content coordinates

        let swiperContentRange = evaluateCoordinates();

        props.rememberCoordinateRange(props.component, swiperContentRange);
        // console.log(opt,props.content.itemsCoordinateRange.updated,rerender )
      
    }

    const evaluateCoordinates = () => {
        // Calculate swiper content coordinates
        
        let swiperContent = setRef(`${props.component}Content`);
    
        let updatedSwiperContentCoordinateRange = {
            key: props.component,
            topCoordinate: window.scrollY + swiperContent.current.getBoundingClientRect().top,
            bottomCoordinate: window.scrollY + swiperContent.current.getBoundingClientRect().bottom,
            leftCoordinate: window.scrollX + swiperContent.current.getBoundingClientRect().left,
            rightCoordinate: window.scrollX + swiperContent.current.getBoundingClientRect().right,
            width: swiperContent.current.getBoundingClientRect().width,
            updated: true
        };
        // console.log(swiperContent.current)
        return updatedSwiperContentCoordinateRange;
    }

    const smoothTransition = () => {
        let _slides = [];
        let slides = [...props.swiperData.slides];
        let activeIndex = props.swiperData.activeIndex;
        if(props.showNumbersOfSlides === 1){
            _slides = updateSlidesFullScreen(slides, activeIndex);
            // setState({
            //     ...state,
            //     _slides,
            //     transition: 0,
            //     translate: getTranslateValue(props.translateWidth, props.translateHeight)
            // })
            if(props.component === currentSwiper){
                props.setSwiperState(props.swiperData.slides, _slides, activeIndex, getTranslateValue(props.translateWidth, props.translateHeight), 0, props.swiperData.rerender);
            }
            
        }
        if(props.showNumbersOfSlides === 3){
            if(activeIndex === slides.length - 1){
                _slides = [slides[slides.length - 2], slides[slides.length - 1], slides[0], slides[1], slides[2]];
            }
            if (activeIndex === 0){
                _slides = [slides[slides.length - 1], slides[0], slides[1], slides[2], slides[3]];
            }
            if(activeIndex === 1){
                _slides = slides.slice(activeIndex - 1, activeIndex + 5);
            }
            if(activeIndex === 2){
                _slides = [slides[1], slides[2], slides[3], slides[slides.length - 1], slides[0]];
            }
            if(activeIndex === 3){
                _slides = [slides[2], slides[3], slides[slides.length - 1], slides[0], slides[1]];
            }
            console.log("7")
            setState({
                ...state,
                _slides,
                transition: 0,
                translate: getTranslateValue(props.translateWidth, props.translateHeight)
            })
        }
      
    }

    const updateSlidesFullScreen = (slides, activeIndex) => {
        let _slides = [];
        //We're at the last slides
        if(activeIndex === slides.length - 1)
        _slides = [props.swiperData.slides[slides.length - 2], slides[slides.length - 1], slides[0]];
        //We're back at the first slide. Just reset to how it was on initial render.
        else if (activeIndex === 0) _slides = [slides[slides.length - 1], slides[0], slides[1]]
        // Create an array of the previous last slide, and the next two slides that follow it.
        else _slides = slides.slice(activeIndex - 1, activeIndex + 2);

        return _slides;
    }

    const prevSlide = (_slides) => {
        // setState({
        //     ...state,
        //     translate: 0,
        //     activeIndex: activeIndex === 0 ? slides.length - 1 : activeIndex - 1
        // })
        let activeIndex = props.swiperData.activeIndex === 0 ? props.swiperData.slides.length - 1 : props.swiperData.activeIndex - 1;
        let translate = 0;
        let _updatedSlides = _slides ? _slides : props.swiperData._slides;
        props.setSwiperState(props.swiperData.slides, _updatedSlides, activeIndex, translate, props.swiperData.transition, true);
    }

    const nextSlide = (_slides, translateVal) => {
        // setState({
        //     ...state,
        //     translate: translate + getTranslateValue(props.translateWidth, props.translateHeight),
        //     activeIndex: activeIndex === slides.length - 1 ? 0 : activeIndex + 1
        // })
        let activeIndex = props.swiperData.activeIndex === props.swiperData.slides.length - 1 ? 0 : props.swiperData.activeIndex + 1
        let translate = translateVal ? translateVal + getTranslateValue(props.translateWidth, props.translateHeight) : props.swiperData.translate + getTranslateValue(props.translateWidth, props.translateHeight);
        let _updatedSlides = _slides ? _slides : props.swiperData._slides;
        props.setSwiperState(props.swiperData.slides, _updatedSlides, activeIndex, translate, props.swiperData.transition, true);
       
    }

    const openPhotoViewer = (component, activeIndex) => {
        let slidesForPhotoViewer = [...props.swiperData.slides];
        let removedSlides = [];
        // let currentSlideIndex = slidesForPhotoViewer.findIndex(item => item.id === id);
              
        slidesForPhotoViewer.map((el, i) => {
            if(i < activeIndex){
                removedSlides.push(el);
            }
        })
        slidesForPhotoViewer.splice(0, activeIndex)
      
        if(removedSlides.length !== 0){
            slidesForPhotoViewer.push(removedSlides);
        }

        slidesForPhotoViewer = slidesForPhotoViewer.flat();
        props.photoViewerOpen(component, true, slidesForPhotoViewer);
    }

    const handleMouseEnter = (opt) => {
        switch(opt){
            case 'leftArrow': 
                setIsHoveringLeftArrow('on');
                break;
            case 'rightArrow': 
                setIsHoveringRightArrow('on');
                break;
        }
    }

    const handleMouseLeave = (opt) => {
        switch(opt){
            case 'leftArrow': 
                setIsHoveringLeftArrow('off');
                break;
            case 'rightArrow': 
                setIsHoveringRightArrow('off');
                break;
        }
    }

    const renderClassName = (opt, isHovering) => {
        if(['testimonialsPageSection1','testimonials','testimonialsPageSection3'].includes(opt)){
            return "swiper-testimonials"
        }
        if(opt === 'testimonialsPageSection2'){
            return "swiper-testimonials-page-section-2"
        }
        if(opt === "bigSlider"){
            return "swiper-big-slider"
        }
        if(opt === "smallSlider"){
            return "swiper-small-slider"
        }
        if(opt === "leftArrow"){
            switch(isHovering){
                case 'init':
                    return "swiper-arrow-left-wrapper";
                case 'on':
                    return "swiper-arrow-left-wrapper-hover-on";
                case 'off':
                    return "swiper-arrow-left-wrapper-hover-off"
            }
        }
        if(opt === "rightArrow"){
            switch(isHovering){
                case 'init':
                    return "swiper-arrow-right-wrapper";
                case 'on':
                    return "swiper-arrow-right-wrapper-hover-on";
                case 'off':
                    return "swiper-arrow-right-wrapper-hover-off"
            }
        }      
    }

    const loadImage = (img) => {
        switch(img) {
            case 'id1BigSlider1': 
                return Images.ID_1_BIG_SLIDER_1;
            case 'id1BigSlider2': 
                return Images.ID_1_BIG_SLIDER_2;
            case 'id1BigSlider3': 
                return Images.ID_1_BIG_SLIDER_3;
            case 'id1BigSlider4': 
                return Images.ID_1_BIG_SLIDER_4;
            case 'id1BigSlider5': 
                return Images.ID_1_BIG_SLIDER_5;
            case 'id2BigSlider1': 
                return Images.ID_2_BIG_SLIDER_1;
            case 'id2BigSlider2': 
                return Images.ID_2_BIG_SLIDER_2;
            case 'id2BigSlider3': 
                return Images.ID_2_BIG_SLIDER_3;
            case 'id2BigSlider4': 
                return Images.ID_2_BIG_SLIDER_4;
            case 'id2BigSlider5': 
                return Images.ID_2_BIG_SLIDER_5;
            case 'id2BigSlider6': 
                return Images.ID_2_BIG_SLIDER_6;
            case 'id3BigSlider1': 
                return Images.ID_3_BIG_SLIDER_1;
            case 'id3BigSlider2': 
                return Images.ID_3_BIG_SLIDER_2;
            case 'id3BigSlider3': 
                return Images.ID_3_BIG_SLIDER_3;
            case 'id3BigSlider4': 
                return Images.ID_3_BIG_SLIDER_4;
            case 'id3BigSlider5': 
                return Images.ID_3_BIG_SLIDER_5;
            case 'id3BigSlider6': 
                return Images.ID_3_BIG_SLIDER_6;
            case 'id3BigSlider7': 
                return Images.ID_3_BIG_SLIDER_7;
            case 'id1SmallSlider1': 
                return Images.ID_1_SMALL_SLIDER_1;
            case 'id1SmallSlider2': 
                return Images.ID_1_SMALL_SLIDER_2;
            case 'id1SmallSlider3': 
                return Images.ID_1_SMALL_SLIDER_3;
            case 'id1SmallSlider4': 
                return Images.ID_1_SMALL_SLIDER_4;
            case 'id1SmallSlider5': 
                return Images.ID_1_SMALL_SLIDER_5;
            case 'id1SmallSlider6': 
                return Images.ID_1_SMALL_SLIDER_6;
            case 'id2SmallSlider1': 
                return Images.ID_2_SMALL_SLIDER_1;
            case 'id2SmallSlider2': 
                return Images.ID_2_SMALL_SLIDER_2;
            case 'id2SmallSlider3': 
                return Images.ID_2_SMALL_SLIDER_3;
            case 'id2SmallSlider4': 
                return Images.ID_2_SMALL_SLIDER_4;
            case 'id2SmallSlider5': 
                return Images.ID_2_SMALL_SLIDER_5;
            case 'id3SmallSlider1': 
                return Images.ID_3_SMALL_SLIDER_1;
            case 'id3SmallSlider2': 
                return Images.ID_3_SMALL_SLIDER_2;
            case 'id3SmallSlider3': 
                return Images.ID_3_SMALL_SLIDER_3;
            case 'id3SmallSlider4': 
                return Images.ID_3_SMALL_SLIDER_4;
            default:
                return ""; 
        }
    }

    const renderSwiper = () => {
        if(props.content.loading && !props.content.error){
            return(
                <div className="content-array-loading-error">
                    <Loading color="white"/>
                </div>
            )
        }
        if(!props.content.loading && !props.content.error){
            return(
                <>
                    {swiper()}
                </>
            )
        }
        if(!props.content.loading && props.content.error){
            return(
                <div className="content-array-loading-error">
                    <H19 className="h19-nobel-lora">{`${props.content.error}`}</H19>
                </div>
            )
        }
    } 

    const setRef = (opt) => {
        switch(opt){
            case 'testimonialsContent':
                return testimonialsContent;
            case 'bigSliderContent':
                return bigSliderContent;
            case 'smallSliderContent':
                return smallSliderContent;
            case 'testimonialsPageSection1Content':
                return testimonialsPageSection1Content;
            case 'testimonialsPageSection2Content':
                return testimonialsPageSection2Content;
            case 'testimonialsPageSection3Content':
                return testimonialsPageSection3Content;
        }
    }

    const swiper = () => {
        if(!props.content.loading){
            if(props.translateWidth){
                return(
                    <div 
                        className="swiper-window-width-content" 
                        id={`swiper-content-${props.component}`}
                        onMouseEnter={handleMouseEnter} 
                        onMouseLeave={handleMouseLeave}
                        style={{
                            transform: `translateX(-${props.swiperData.translate}px)`,
                            transition: `transform ${props.swiperData.transition}s ease-out`,
                            width: `${getTranslateValue(props.translateWidth, props.translateHeight) * props.contentArray.length}px`
                        }}
                    >{props.swiperData._slides.map((el, i) => {
                        if(['testimonialsPageSection2'].includes(props.component)){
                            return(
                                <div 
                                    key={i} 
                                    className="slide"
                                    id="slide"
                                    style={{width: `${getTranslateValue(props.translateWidth, props.translateHeight)}px`}}
                                >
                                <H45 className="h45-nero-lustria">{el.header}</H45>
                                <EH25/>
                                <H25 className="h25-nobel-lustria">{el.feedback}</H25>
                                <EH25/>
                                    <div className="author-name-wrapper">
                                        <div className="slide-dash"/>
                                        <H25 className="h25-nero2-teko">{el.author}</H25>
                                    </div>
                                </div>
                            )
                        }
                        if(['testimonialsPageSection1','testimonials','testimonialsPageSection3'].includes(props.component)){
                            return(
                                <div 
                                    key={i} 
                                    className="slide"
                                    id="slide"
                                    style={{width: `${getTranslateValue(props.translateWidth, props.translateHeight)}px`}}
                                >
                                <H25 className="h25-white-lustria">{el.feedback}</H25>
                                <EH25/>
                                    <div className="author-name-wrapper">
                                        <div className="slide-dash"/>
                                        <H25 className="h25-white-teko">{el.author}</H25>
                                    </div>
                                </div>
                            )
                        }
                        if(props.component === "bigSlider"){
                            return(
                                <div 
                                    key={i} 
                                    className="slide"
                                    id="slide"
                                    style={{width: `${getTranslateValue(props.translateWidth, props.translateHeight)}px`}}
                                >
                                    <div 
                                        className="slide-image"
                                        // onClick={() => openPhotoViewer(el.id)}
                                    >
                                        <img src={loadImage(el.key)}/>
                                    </div>
                                </div>
                            )
                        }
                        if(props.component === "smallSlider"){
                            return(
                                <div 
                                    key={i} 
                                    className="slide"
                                    id="slide"
                                    style={{width: `${getTranslateValue(props.translateWidth, props.translateHeight)}px`}}
                                >
                                    <div 
                                        className="slide-image"
                                        // onClick={() => openPhotoViewer(el.id)}
                                    >
                                        <img src={loadImage(el.key)}/>
                                    </div>
                                </div>
                            )
                        }
                    })}</div>
                )
            }
            if(props.translateHeight){
                return(
                    <div 
                        className="swiper-window-height-content" 
                        id="swiper-content"
                        onMouseEnter={handleMouseEnter} 
                        onMouseLeave={handleMouseLeave}
                        style={{
                            transform: `translateY(-${translate}px)`,
                            transition: `transform ${transition}s ease-out`,
                            height: `${getTranslateValue(props.translateWidth, props.translateHeight)}px`
                        }}
                    >{_slides.map((el, i) => {
                        return(
                            <div 
                                key={i} 
                                className="slide"
                                style={{height: `${getTranslateValue(props.translateWidth, props.translateHeight)}px`}}
                            >
                                <img src={loadImage(el)}/>
                            </div>
                        )
                    })}</div>
                )
            }
        }
    }

    const renderFirstArrow = () => {
        if(props.translateWidth){
            if(props.component === "smallSlider"){
                return(
                    <div className="swiper-arrow-left">
                        <div 
                            // className="swiper-arrow-left-wrapper"
                            className={renderClassName("leftArrow", isHoveringLeftArrow)}
                            onClick={() => prevSlide(null, null)}
                            onMouseEnter={() => handleMouseEnter('leftArrow')} 
                            onMouseLeave={() => handleMouseLeave('leftArrow')}
                            id="prev"
                        >
                            <div className="swiper-arrow-left-line"/>
                        </div>
                    </div>
                )
            }
            if(['testimonials','bigSlider','testimonialsPageSection3'].includes(props.component)){
                return(
                    <div className="swiper-arrow-left">
                        <div 
                            // className="swiper-arrow-left-wrapper"
                            className={renderClassName("leftArrow", isHoveringLeftArrow)}
                            onClick={() => prevSlide(null, null)}
                            onMouseEnter={() => handleMouseEnter('leftArrow')} 
                            onMouseLeave={() => handleMouseLeave('leftArrow')}
                            id="prev"
                        >
                            <div className="h17-white-lustria">Previous</div>
                            <div className="swiper-arrow-left-line"/>
                        </div>
                    </div>
                )
            }
        }
        if(props.translateHeight){
            return(
                <div 
                    className="swiper-arrow-up"
                    onClick={() => prevSlide(null, null)}
                    onMouseEnter={handleMouseEnter} 
                >
                    <FontAwesomeIcon 
                        icon={faChevronUp} 
                        size="sm" 
                        color="white" 
                        className="icon"
                    />
                </div>
            )
        }
    }

    const renderSecondArrow = () => {
        if(props.translateWidth){
            if(props.component === "smallSlider"){
                return(
                    <div className="swiper-arrow-right">
                        <div 
                            // className="swiper-arrow-right-wrapper"
                            className={renderClassName("rightArrow", isHoveringRightArrow)}
                            onClick={() => nextSlide(null, null)}
                            onMouseEnter={() => handleMouseEnter('rightArrow')} 
                            onMouseLeave={() => handleMouseLeave('rightArrow')}
                            id="next"
                        >
                            <div className="swiper-arrow-right-line"/>
                        </div>
                    </div>
                )
            }
            if(['testimonials','bigSlider','testimonialsPageSection3'].includes(props.component)){
                return(
                    <div className="swiper-arrow-right">
                        <div 
                            // className="swiper-arrow-right-wrapper"
                            className={renderClassName("rightArrow", isHoveringRightArrow)}
                            onClick={() => nextSlide(null, null)}
                            onMouseEnter={() => handleMouseEnter('rightArrow')} 
                            onMouseLeave={() => handleMouseLeave('rightArrow')}
                            id="next"
                        >
                            <div className="h17-white-lustria">Next</div>
                            <div className="swiper-arrow-right-line"/>
                        </div>
                    </div>
                )
            }
        }
        if(props.translateHeight){
            return(
                <div 
                    className="swiper-arrow-down"
                    onClick={() => nextSlide(null, null)}
                    onMouseEnter={handleMouseEnter} 
                >
                    <FontAwesomeIcon 
                        icon={faChevronDown} 
                        size="sm" 
                        color="white" 
                        className="icon"
                    /> 
                </div>
            )
        }
    }


    /**
     * Markup
     */

    return(
        <>
            <div 
                className={renderClassName(props.component)} 
                id="swiper"
                ref={setRef(`${props.component}Content`)}
            >
                {renderFirstArrow()}
                <div className="swiper-wrapper" id={`swiper-wrapper-${props.component}`}>
                    {renderSwiper()}
                </div>
                {renderSecondArrow()}
            </div>
            {props.photoViewerForBigSliderOpen ? 
            <PhotoViewer
                width={700}
                height={457}
                component="bigSlider"
            /> : null}
            {props.photoViewerForSmallSliderOpen ? 
            <PhotoViewer
                width={700}
                height={457}
                component="smallSlider"
            /> : null}
        </>
    );
}

export default connect(
    (state) => {
        return {
            // swiperData: Selectors.getSwiperDataState(state),
            photoViewerForBigSliderOpen: Selectors.getPhotoViewerForBigSliderOpenState(state),
            photoViewerForSmallSliderOpen: Selectors.getPhotoViewerForSmallSliderOpenState(state),
        };
    },
    (dispatch) => {
        return {
            // fetchSection1Data: bindActionCreators(Services.fetchSection1Data, dispatch),
            // setSwiperState: bindActionCreators(Actions.setSwiperState, dispatch),
            photoViewerOpen: bindActionCreators(Actions.photoViewerOpen, dispatch),
            // photoViewerOpen: bindActionCreators(Actions.photoViewerOpen, dispatch),
        };
    }
)(Swiper);
 