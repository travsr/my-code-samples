import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import domtoimage from 'dom-to-image';

import { InputGroup, FormControl } from 'react-bootstrap';
import { AiOutlineZoomIn, AiOutlineZoomOut} from 'react-icons/ai';

import { 
    setCurrentAction, 
    setScaleFactor,
    updateElementProps, 
    selectElements,
    setZoomFactor
} from '../Redux/Actions';

import { 
    transformDimensions, 
    calcSnappedCoords, 
    snapToGrid,
    calculatePageSize
} from '../Utils/Transforms';

import AppConstants from '../Constants/Constants';

import Grid from './Grid';
import Renderer from '../Elements/_Renderer';
import RendererHandles from '../Elements/_RendererHandles';
import Options from './Options';
import Toolbar from './Toolbar';
import PageOptions from './PageOptions';

const mapStateToProps = state => ({
    aspect_ratio: state.canvas.aspect_ratio,
    device: state.canvas.page.device,
    device_width: state.canvas.page.device.width,
    device_height: state.canvas.page.device.height,
    scale_factor: state.canvas.page.scale_factor,
    zoom_factor: state.canvas.page.zoom_factor,
    current_action: state.canvas.current_action,
    elements: state.canvas.page.elements,
    selected_elements: state.canvas.selected_elements,
    selected_elements_map: state.canvas.selected_elements_map,
    selected_tool_name: state.canvas.selected_tool_name,
    show_grid: state.canvas.page.show_grid
});

const mapDispatchToProps = dispatch => ({
    setCurrentAction: action => dispatch( setCurrentAction(action) ),
    setScaleFactor: scale_factor => dispatch( setScaleFactor(scale_factor)),
    updateElementProps: (id, props) => dispatch( updateElementProps(id, props)),
    selectElements: elements => dispatch( selectElements(elements)),
    setZoomFactor: zoom_factor => dispatch( setZoomFactor(zoom_factor))
});




const sidebar_width = 0;
let mouse_position = {x: 0, y: 0};


class Canvas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spacebar_pressed: false,

            translateX: -(this.props.width * 3.5),
            translateY: -(this.props.height * 3.5),
            zoom: .3333,

            canvas_width: this.props.width * 8,
            canvas_height: this.props.height * 8,

            selection_box_active: false,
            selection_box: {x1: 0, y1: 0, x2: 0, y2: 0}
        }

        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleMouseUp = this._handleMouseUp.bind(this);
        this._handleMouseDown = this._handleMouseDown.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._handleKeyUp = this._handleKeyUp.bind(this);
        this._handleMouseWheel = this._handleMouseWheel.bind(this);
        this._calculatePageSize = this._calculatePageSize.bind(this);
        this._handleZoom = this._handleZoom.bind(this);

        
    }

    componentDidMount() {
        window.addEventListener('resize', this._calculatePageSize);
        this._calculatePageSize();

       
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._calculatePageSize);
    } 

    componentDidUpdate() {
        // console.log("componentDidUpdate() " + Math.random());
        // console.log(this.props.device.name);

    }

    static getDerivedStateFromProps(props, state) {
        // ...

        // console.log("getDerivedStateFromProps() " + Math.random());
        // console.log(props.device.name);
        return null;
    }

    _calculatePageSize() {


        let {scale} = calculatePageSize({
            width: this.props.width,
            height: this.props.height,
            device: this.props.device,
        });
        this.props.setScaleFactor(scale);


        // force render() to be called here
        this.setState({rerender: Math.random()});


    }

    _handleMouseMove(e) {

        //console.log(e.clientX, e.clientY);

        // calculate the dY dX of the mouse position
        let dY = e.clientY - mouse_position.y;
        let dX = e.clientX - mouse_position.x;

        dY /= this.state.zoom;
        dX /= this.state.zoom;

        mouse_position = {x: e.clientX, y: e.clientY};


        if(this.props.selected_tool_name == "select") {
            // If a resize or move action is in progress, calculate the new size and position of the selected element
            if(this.props.current_action.type == 'move' || this.props.current_action.type.indexOf('resize') != -1) {


                // Gather all the selected elements into one array
                let targetElements = [];
                this.props.elements.forEach((element) => {
                    if(  this.props.selected_elements_map[element.id]    ) {
                        targetElements.push(element);
                    }
                });

                // Update each selected element's coordinates
                targetElements.forEach((targetElement) => {

                    // Calculate the new size and position of the object, factoring in the mouse's movement
                    let {x1, x2, y1, y2} = transformDimensions({
                        current_action: this.props.current_action,
                        scale_factor: this.props.scale_factor,
                        dX,
                        dY,
                        coords: targetElement.attributes.raw_coords
                    });

                    let raw_coords = {x1, x2, y1, y2};
                    // let coords = {...raw_coords};


                    // // Calculate the displayed coordinates of the object, based on snapping
                    let coords = calcSnappedCoords({
                        target_id: this.props.current_action.target_id,
                        elements: this.props.elements,
                        device_width: this.props.device_width,
                        device_height: this.props.device_height,
                        x1: x1,
                        y1: y1,
                        x2: x2,
                        y2: y2,
                        scale_factor: this.props.scale_factor
                    });

                    //console.log(coords);


                    // let coords = snapToGrid({
                    //     device_width: this.props.device_width,
                    //     scale_factor: this.props.scale_factor,
                    //     coords: raw_coords});

                    // let coords = {...raw_coords};


                    // Update the element's props
                    this.props.updateElementProps(targetElement.id, {
                        raw_coords: raw_coords,
                        coords: coords
                    });

                });
            }
            // Pan the page
            else if(this.props.current_action.type == "idle" && this.state.spacebar_pressed) {
          

                this.setState({
                    translateX: this.state.translateX += dX,
                    translateY: this.state.translateY += dY
                });
            }
            else if(this.props.current_action.type == "idle") {

                if(this.state.selection_box_active) {
                    this.setState({
                        selection_box: {
                            ...this.state.selection_box,
                            x2: e.clientX,
                            y2: e.clientY
                        }
                    });
                }


            }

        }

    }

    _handleMouseUp(e) {

        let { device_frame_height, device_frame_width } = calculatePageSize({
            width: this.props.width,
            height: this.props.height,
            device: this.props.device
        });

        let transformX = (x) => {
            x += document.querySelector('.canvas_outer').scrollLeft;
            x -= ( (this.props.width) - device_frame_width  )/2;
            x /= this.props.scale_factor;
            return x;
        }

        let transformY = (y) => {
            y += document.querySelector('.canvas_outer').scrollTop;
            y -= ( (this.props.height) - device_frame_height  )/2;
            y /= this.props.scale_factor;
            return y;
        }



        // If the selection box was active, we need to determine if there are any elements within that need to be selected.
        if(this.state.selection_box_active) {
            console.log("Selection box was active.");
            console.log(this.state.selection_box);
            
            // transform bounding box coordinates to display coordinates, taking into account scroll distance
            let x1, x2, y1, y2, minX, minY, maxX, maxY;

            x1 = transformX(this.state.selection_box.x1);
            x2 = transformX(this.state.selection_box.x2);
            y1 = transformY(this.state.selection_box.y1);
            y2 = transformY(this.state.selection_box.y2);

            minX = Math.min(x1, x2);
            minY = Math.min(y1, y2);
            maxX = Math.max(x1, x2);
            maxY = Math.max(y1, y2);

            let targetElements = [];

            this.props.elements.forEach((element) => {

                let coords = element.attributes.coords;
                if(coords.x1 >= minX && coords.x2 <= maxX && coords.y1 >= minY && coords.y2 <= maxY) {
                    targetElements.push({
                        id: element.id,
                        type: element.type
                    });
                }

            });

            this.props.selectElements(targetElements);

            // console.log(x1, y1, x2, y2);



        }



        console.log("Mouse up");
        this.props.setCurrentAction({
            type: "idle"
        });

        this.setState({selection_box_active: false});
    }

    _handleMouseDown(e) {
        console.log("canvas mouse down " + Math.random() );

        console.log("current action: ");
        console.log(this.props.current_action);


        // Place a new element on the canvas where the mouse is located
        if(this.props.current_action.type == "place") {


        }
        if(this.props.current_action.type == "idle") {

            // Update the coordinates of the selections box

            // If the box isn't already active, make it active and define a new bounding box
            if(!this.state.selection_box_active) {
                this.setState({
                    selection_box_active: true,
                    selection_box: {x1: e.clientX, x2: e.clientX, y1: e.clientY, y2: e.clientY}
                });
            }


        }

        // Deselect any selected elements
        this.props.selectElements([]);
    }

    _handleKeyDown(e) {
        console.log(e.keyCode);

        // Get the targeted element from the list of elements
        // Gather all the selected elements into one array
        let targetElements = [];
        this.props.elements.forEach((element) => {
            if(  this.props.selected_elements_map[element.id]    ) {
                targetElements.push(element);
            }
        });

        // Nudge objects using arrow keys
        if(this.props.current_action.type == 'idle' && targetElements.length > 0) {

            
            targetElements.forEach((targetElement) => {
                
                let raw_coords = targetElement.attributes.raw_coords;
                let coords = targetElement.attributes.coords;


                // Nudge up
                if(e.keyCode == 38) {
                    this.props.updateElementProps(targetElement.id, {
                        raw_coords: {...raw_coords, y1: raw_coords.y1 - 1, y2: raw_coords.y2 - 1},
                        coords: {...coords, y1: coords.y1 - 1, y2: coords.y2 - 1}
                    });
                }
                // Nudge down
                else if(e.keyCode == 40) {
                    this.props.updateElementProps(targetElement.id, {
                        raw_coords: {...raw_coords, y1: raw_coords.y1 + 1, y2: raw_coords.y2 + 1},
                        coords: {...coords, y1: coords.y1 + 1, y2: coords.y2 + 1}
                    });
                }
                // Nudge left
                else if(e.keyCode == 37) {
                    this.props.updateElementProps(targetElement.id, {
                        raw_coords: {...raw_coords, x1: raw_coords.x1 - 1, x2: raw_coords.x2 - 1},
                        coords: {...coords, x1: coords.x1 - 1, x2: coords.x2 - 1}
                    });
                }
                // Nudge right
                else if(e.keyCode == 39) {
                    this.props.updateElementProps(targetElement.id, {
                        raw_coords: {...raw_coords, x1: raw_coords.x1 + 1, x2: raw_coords.x2 + 1},
                        coords: {...coords, x1: coords.x1 + 1, x2: coords.x2 + 1}
                    });
                }

            });

        }

        // Zoom in (ctrl + )
        if(e.keyCode == 61) {
          //  console.log("zoom in");
         //   this._zoomCanvas(this.props.zoom_factor * 1.1);
//
            
        }
        if(e.keyCode == 173) {
            console.log("zoom out");
            this._zoomCanvas(this.props.zoom_factor * .9);

            
        }

        // Spacebar pressed
        if(e.keyCode == 32) {
            this.setState({spacebar_pressed: true});
        }


        e.preventDefault();

    }

    _handleKeyUp(e) {
        if(e.keyCode == 32) {
            this.setState({spacebar_pressed: false});
        }
    }

    _handleMouseWheel(e) {

       // console.log(e.deltaY, e.deltaX);

        this.setState({
            translateY: this.state.translateY - ((e.deltaY)/this.state.zoom),
            translateX: this.state.translateX - ((e.deltaX)/this.state.zoom)
        });

    }

    _handleZoom(zoom) {



        this.setState({
            zoom
        });

        this.props.setZoomFactor(zoom);



    }

    render() {

        let { device_frame_height, device_frame_width } = calculatePageSize({
            width: this.props.width,
            height: this.props.height,
            device: this.props.device
        });
   
        return(
            <React.Fragment>
            
                <div 
                    id="canvas_outer"
                    className="canvas_outer"

                    onWheel={this._handleMouseWheel}
                    style={{
                        width: this.props.width,
                        height: this.props.height,

                        transform: "scale3d(" + this.state.zoom + ", "+this.state.zoom+", 1)",
                    }}>
                    <div
                        style={{
                            transform: "translate("+(this.state.translateX)+"px,"+(this.state.translateY)+"px)"
                        }}
                    >
                        <div
                            className="my_canvas"
                            onMouseDown={this._handleMouseDown}
                            onMouseUp={this._handleMouseUp} 
                            onMouseMove={this._handleMouseMove} 
                            onKeyDown={this._handleKeyDown}
                            onKeyUp={this._handleKeyUp}
                            style={{
                                width: this.state.canvas_width,
                                height: this.state.canvas_height,
                                backgroundColor: "#123",
                            }}
                            tabIndex="0">
                            
                            {/* page container */}
                            <div 
                                id="device_container"
                                style={{
                                    width: device_frame_width, 
                                    height: device_frame_height, 
                                    position: "relative"
                                }}>
                                    {/* page outline */}
                                    
                                    <div style={{
                                        position: "absolute", 
                                        top: 0, left: 0, right: 0, bottom: 0, 
                                        pointerEvents: "none", 
                                        outline: "10000px solid rgba(0,0,0,.4)"
                                    }}></div>


                                    <Renderer />
                                    {this.props.show_grid && 
                                        <Grid zoom={this.state.zoom} canvas_width={this.state.canvas_width} canvas_height={this.state.canvas_height} />
                                    }
                                    
                                    


                                    {/* device outline */}
                                    <div className="device-outline" style={{
                                        position: "absolute", 
                                        top: this.props.device.top,
                                        left: this.props.device.left,
                                        right: this.props.device.right,
                                        bottom: this.props.device.bottom,
                                        pointerEvents: "none", 
                                        backgroundImage: "url(" + this.props.device.imageUrl + ")",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        transform: "scale3d(1,1,1)"
                                    }}></div>


                                    <RendererHandles />  
                            </div>
                            
                        </div>
                    </div>
                </div>


                {/* Selection Box */}
                {this.state.selection_box_active && 
                
                    <div style={{
                        position: "absolute",
                        top: Math.min(this.state.selection_box.y1, this.state.selection_box.y2),
                        left: Math.min(this.state.selection_box.x1, this.state.selection_box.x2),
                        width: Math.abs(this.state.selection_box.x2 -  this.state.selection_box.x1),
                        height: Math.abs(this.state.selection_box.y2 - this.state.selection_box.y1),
                        border: "1px solid pink"
                    }}></div>
                }



                {/* zoom */}
                <div style={{padding: 4, backgroundColor: "#222", position: "fixed", left: 10, bottom: 10}}>
                    
                    <Button style={{borderRadius: 0, marginRight: 2}} variant="secondary" size="sm" onClick={()=>this._handleZoom(this.state.zoom * .5)} >
                        <AiOutlineZoomOut   />
                    </Button>

                    <Button style={{borderRadius: 0, marginRight: 2}}  variant="secondary" size="sm" onClick={()=>this._handleZoom(.33333)} >
                        <AiOutlineZoomIn    />
                    </Button>
                
                    <Button style={{borderRadius: 0, marginRight: 2}}  variant="secondary" size="sm" onClick={()=>this._handleZoom(this.state.zoom * 1.7)} >
                        <AiOutlineZoomIn    />
                    </Button>
                </div>

            </React.Fragment>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Canvas);