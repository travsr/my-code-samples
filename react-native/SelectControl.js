import React, { Component } from 'react';
import { connect } from 'react-redux';

import {View, Text, TouchableNativeFeedback} from 'react-native';
import {Icon} from 'react-native-elements';

import Slider from '@react-native-community/slider';
import { BROWN_PRIMARY } from '../../Constants/Colors';




const mapStateToProps = state => ({
    // scale_factor: state.canvas.page.scale_factor,
    // device_width: state.canvas.page.device.width,
    // device_height: state.canvas.page.device.height,
    // selected_tool_name: state.canvas.selected_tool_name
});

const mapDispatchToProps = dispatch => ({
    // setCurrentAction: action => dispatch( setCurrentAction(action) ),
    // selectTool: tool => dispatch( selectTool(tool))
});




class SelectControl extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        }


        this._handleItemSelect = this._handleItemSelect.bind(this);


    }

    componentDidMount() {
        if(this.props.defaultValue) {
            this.setState({value: this.props.defaultValue});
        }
    }

    _handleItemSelect(value) {

        if(this.state.value != value) {
            this.setState({value})
            this.props.onPress(value)
        }
        else {
            this.setState({value: ""});
            this.props.onPress("");
        }
    }




    render() {

        let labelStyle ={ color: BROWN_PRIMARY, fontSize: 12};
        let viewStyle = {justifyContent: "center", alignItems: "center", paddingTop: 10, paddingBottom: 10, paddingLeft: 14, paddingRight: 14, borderRadius: 2};



        return(
            <View>

                <View style={{flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center"}}>
                    {this.props.options.map((item, i) => 
                        <TouchableNativeFeedback key={i} onPress={()=>this._handleItemSelect(item.value)}>

                            <View>

                           
                                {this.state.value == item.value && 
                                    <View style={{...viewStyle, backgroundColor: this.props.highlight}}>
                                        {item.iconOn}
                                        {item.label && <Text style={{...labelStyle, color: "#fff", fontWeight: "bold"}}>{item.label}</Text>}
                                    </View>
                                }
                                {this.state.value != item.value && 
                                    <View style={{...viewStyle}}>
                                        {item.iconOff}
                                        {item.label && <Text style={{...labelStyle}}>{item.label}</Text> }
                                    </View>
                                }
                             </View>
                            
                        </TouchableNativeFeedback>
                    )}
                </View>

              
            </View>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SelectControl);