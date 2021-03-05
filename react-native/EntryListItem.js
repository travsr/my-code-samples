import React, { Component } from 'react';
import { connect } from 'react-redux';

import {View, Text, TouchableNativeFeedback, TouchableWithoutFeedback, Picker} from 'react-native';
import {Icon} from 'react-native-elements';

import {BROWN_PRIMARY, ROAST_COLORS} from '../Constants/Colors';
import { withRouter } from 'react-router-native';
import Bean from '../Icons/Bean';
import CompassDisplay from './CompassDisplay';
import moment from 'moment';
import TimeText from './TimeText';
import { editEntry } from '../Redux/Actions'; 




const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    editEntry: (id, data) => dispatch( editEntry(id, data) )
});


class EntryListItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this._handleStarPress = this._handleStarPress.bind(this);
        this._handleLongPress = this._handleLongPress.bind(this);

    }

    componentDidMount() {


    }

    _handleStarPress() {

        if(this.props.starred == "yes") {
            this.props.editEntry(this.props.id, {starred: "no"});
        }
        else {
            this.props.editEntry(this.props.id, {starred: "yes"});
        }

        

        // alert(this.props.id);
        
    }

    _handleLongPress() {

        alert("Long pressed");
    }




    render() {

        let metricStyle = {
            width: 50,
            height: 50,
            alignItems: "center",
            justifyContent: "center"
        }

        

        let now = "";
        if(this.props.date) {
            now = moment(this.props.date).fromNow();
        }

        let roast_color = ROAST_COLORS[this.props.roast];

        let ratio = this.props.ratio;
        ratio = ratio.toFixed(1);

        let metricTextStyle = {
            color: roast_color,
            fontSize: 11
        }

        return(
            <TouchableWithoutFeedback onLongPress={this._handleLongPress}>
                <View style={{backgroundColor: "#eee", padding: 14, marginBottom: 7}}>

                    <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 10}}>
                        <View>
                            {typeof this.props.coffee_name !== "undefined" && this.props.coffee_name.length > 0 &&
                                <Text style={{fontSize: 15, fontWeight: "bold", color: roast_color}}>{this.props.coffee_name}</Text>
                            }
                            <Text style={{fontSize: 11, color: roast_color}}>{now}</Text>
                        </View>
                        <View>
                            <TouchableNativeFeedback style={{padding: 3}} onPress={this._handleStarPress}>
                                <Icon name="star" type="font-awesome" size={20} containerStyle={{opacity: this.props.starred == "yes" ? 1 : .2}} color={roast_color}/>
                            </TouchableNativeFeedback>
                        </View>
                    </View>

                    <View style={{flexDirection: "row", alignItems: "stretch"}}>


                        <View>
    
                            {/* coffee */}
                            <View style={metricStyle}>
                                <Bean color={roast_color} width={30} height={30} />
                                <Text style={metricTextStyle}>{this.props.coffee} g</Text>
                            </View>
                            {/* water */}
                            <View style={metricStyle}>
                                <Icon name="drop" type="entypo" size={30} color={roast_color} />
                                <Text style={metricTextStyle}>{this.props.water} mL</Text>
                            </View>
                            {/* water_temp */}
                            <View style={metricStyle}>
                                <Icon name="thermometer-three-quarters" type="font-awesome-5" size={30} color={roast_color} />
                                <Text style={metricTextStyle}>{this.props.water_temp} c</Text>
                            </View>
                        </View>

                        <View>
                            {/* time */}
                            <View style={metricStyle}>
                                <Icon name="alarm" type="material-community"  size={30} color={roast_color} />
                                <TimeText style={metricTextStyle} time={this.props.time} />
                            </View>
                            
                            {/* grind_size */}
                            <View style={metricStyle}>
                                <View style={{
                                    backgroundColor: roast_color,
                                    width: this.props.grind_size*2, 
                                    height: this.props.grind_size*2, 
                                    borderRadius: this.props.grind_size
                                }}></View>

                            </View>
                            <View style={metricStyle}>
                                <View style={{height: 30, justifyContent: "center"}}>
                                    <Text style={{fontWeight: "bold", fontSize: 14, color: roast_color}}>{ratio}:1</Text>
                                </View>
                                <Text style={metricTextStyle}>Ratio</Text>
                            </View>
                        </View>

                        <View>
                            <CompassDisplay 
                                color={roast_color}
                                size={150} 
                                strength={this.props.strength} 
                                extraction={this.props.extraction} 
                            />
                        </View>

                        <View style={{flex: 1,justifyContent: "space-between"}}>

                            <View>
                                <Text style={{color: roast_color}}>My Rating</Text>
                                <Text style={{fontWeight: "bold", color: roast_color, fontSize: 24}}>{this.props.overall_rating}</Text>
                            </View>

                            <View>

                                {/* roaster_name */}
                                {typeof this.props.roaster_name !== "undefined" && this.props.roaster_name.length > 0 &&
                                    <View style={{marginTop: 6, alignItems: "flex-start", flexDirection: "row"}}>
                                        
                                        <Text style={{color: roast_color, fontSize: 11, marginRight: 6}}>{this.props.roaster_name}</Text>
                                
                                    </View>
                                }

                                {/* origin */}
                                {typeof this.props.origin !== "undefined" && this.props.origin.length > 0 &&
                                    <View style={{marginTop: 6, alignItems: "center", flexDirection: "row"}}>
                                        
                                        <Text style={{color: roast_color, fontSize: 11, marginRight: 6}}>{this.props.origin}</Text>
                                        <Icon name="map-marker" type="font-awesome" size={11} color={roast_color} />
                                    </View>
                                }

                                {/* brew_method */}
                                {typeof this.props.brew_method !== "undefined" && this.props.brew_method.length > 0 &&
                                    <View style={{marginTop: 6, alignItems: "flex-start", flexDirection: "row"}}>
                                        
                                        <Text style={{color: roast_color, fontSize: 11, marginRight: 6}}>{this.props.brew_method}</Text>
                                
                                    </View>
                                }
                            </View>
                        </View>

                    </View>

                    {typeof this.props.notes !== "undefined" && this.props.notes.length > 0 && 
                        <View style={{marginTop: 20, opacity: .7}}>
                            <Text style={metricTextStyle}>{this.props.notes}</Text>
                        </View>
                    }
            </View>
           </TouchableWithoutFeedback>
        );
    }
}


export default withRouter( connect(mapStateToProps, mapDispatchToProps)(EntryListItem) );