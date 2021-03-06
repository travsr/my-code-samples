import {
    ADD_ELEMENT,
    SET_CURRENT_ACTION,
    SET_SCALE_FACTOR,
    SET_ZOOM_FACTOR,
    SELECT_ELEMENTS,
    SELECT_TOOL,
    UPDATE_ELEMENT_PROPS,
    UPDATE_ELEMENT_OPTIONS,
    SET_DEVICE,
    SET_SHOW_GRID
} from './Constants';

const initialState = {
    current_action: {
        type: "idle",
    },
    snap_to_grid: true, 
    selected_elements: [],
    selected_elements_map: {},
    selected_tool_name: "select", // select | add_object | add_text
    page: {
        show_grid: true,
        scale_factor: 1,
        zoom_factor: .333,
        device:  {
            name: "iPhone X",
            width: 563,
            height: 1218,
            imageUrl: "/static/images/devices/iphonex.png",
            top: "-7.1%", right: "-7.1%", bottom: "-7.1%", left: "-7.1%"
        },
        elements: [
            {
                id: "test-element",
                type: "Block",
                attributes: {
                    coords: {
                        x1: 500,
                        x2: 800,
                        y1: 600,
                        y2: 800
                    },
                    raw_coords: {
                        x1: 500,
                        x2: 800,
                        y1: 600,
                        y2: 800
                    },
                    options: {
                        backgroundImage: "none",
                        backgroundColor: "red",
                        borderWidth: 0
                    }
                }
            },
            {
                id: "test-element-2",
                type: "Block",
                attributes: {

                    coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    raw_coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    options: {
                        backgroundImage: "none",
                        backgroundColor: "blue",
                        borderWidth: 0
                    }
                }
            },

            {
                id: "test-element-3",
                type: "Block",
                attributes: {

                    coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    raw_coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    options: {
                        backgroundImage: "none",
                        backgroundColor: "blue",
                        borderWidth: 0
                    }
                }
            },

            {
                id: "test-element-4",
                type: "Block",
                attributes: {

                    coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    raw_coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    options: {
                        backgroundImage: "none",
                        backgroundColor: "blue",
                        borderWidth: 0
                    }
                }
            },

            {
                id: "test-element-5",
                type: "Block",
                attributes: {

                    coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    raw_coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    options: {
                        backgroundImage: "none",
                        backgroundColor: "blue",
                        borderWidth: 0
                    }
                }
            },
            {
                id: "test-text",
                type: "Text",
                attributes: {
                    
                    coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    raw_coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    options: {
                        text: "The quick brown fox"
                    }
                }
            },
            {
                id: "test-text2",
                type: "Text",
                attributes: {
                    
                    coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    raw_coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    options: {
                        text: "The quick brown fox"
                    }
                }
            },
            {
                id: "test-text3",
                type: "Button",
                attributes: {
                    
                    coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    raw_coords: {
                        x1: 300,
                        x2: 400,
                        y1: 200,
                        y2: 500
                    },
                    options: {
                        text: "The quick brown fox"
                    }
                }
            }
        ]
    }
}

const ReducerCanvas = (state = initialState, action) => {

    let elements = state.page.elements;

    switch(action.type) {
        case ADD_ELEMENT:
            return {...state, elements: [...state.elements, action.payload]};
        case SET_CURRENT_ACTION:
            return {...state, current_action: action.payload};
        case SET_SCALE_FACTOR:
            return {
                ...state, 
                page: {
                    ...state.page,
                    scale_factor: action.payload
                }
            };
        case SET_ZOOM_FACTOR:
            return {
                ...state,
                page: {
                    ...state.page,
                    zoom_factor: action.payload
                }
            };
        case SET_DEVICE: 
            return {
                ...state,
                page: {
                    ...state.page,
                    device: action.payload
                }
            }
        case SET_SHOW_GRID:
            return {
                ...state,
                page: {
                    ...state.page,
                    show_grid: action.payload
                }
            }
        case SELECT_ELEMENTS:

            console.log("select elements");
            let selected_map = {};
            action.payload.forEach((el) => selected_map[el.id] = {...el}  );

            return {
                ...state,
                selected_elements: [...action.payload],
                selected_elements_map: selected_map
            };
        case SELECT_TOOL:
            return {
                ...state,
                selected_tool_name: action.payload
            };
        case UPDATE_ELEMENT_PROPS:
            
            
            elements.forEach((element, i) => {
                if(element.id == action.payload.id) {
                    element.attributes = {...element.attributes, ...action.payload.props}
                }
            });
            return {
                ...state,
                page: {
                    ...state.page,
                    elements: [...elements]
                }
            };
        case UPDATE_ELEMENT_OPTIONS:

            elements.forEach((element, i) => {
                if(element.id == action.payload.id) {
                    element.attributes.options = {...element.attributes.options, ...action.payload.options}
                }
            });
            return {
                ...state,
                page: {
                    ...state.page,
                    elements: [...elements]
                }

            };
        default:
            return state;
    }

}

export default ReducerCanvas;