import React, { Component } from 'react';
import { connect } from 'react-redux';

import {View, Text, TouchableNativeFeedback, Animated} from 'react-native';
import { BG1, BLUE_PRIMARY, BROWN_PRIMARY, ROAST_COLORS, ROAST_TYPES } from '../../Constants/Colors';
import { PieChart, YAxis, XAxis } from 'react-native-svg-charts';
import { Icon } from 'react-native-elements';
import { LABEL_MAP } from '../../Constants/Descriptors';
import moment from 'moment';

const mapStateToProps = state => ({
    entries: state.core.entries,
    filters:  state.core.filters
});

const mapDispatchToProps = dispatch => ({
    // setCurrentAction: action => dispatch( setCurrentAction(action) ),
    // selectTool: tool => dispatch( selectTool(tool))
});

class ScatterPlot extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount() {


    }

    render() {

        let width = 300;
        let height = 300;

        let x_key =  this.props.x_key; //"overall_rating";
        let y_key = this.props.y_key; //"extraction";

        let x_min = 9999999999999;
        let x_max = -99999;

        let y_min = 9999999999999;
        let y_max = -99999;

        let data = [];


        let unfilteredEntries = this.props.entries;
        let entries = [];

        unfilteredEntries.forEach((entry) => {

            if(this.props.filters.length > 0) {

                let should_add = true;

                this.props.filters.forEach((filter) => {
                    if( entry[filter.key] !== filter.value) {
                        should_add = false;
                    }
                });

                if(should_add) {
                    entries.push({...entry});
                }
            }
            else {
                entries.push({...entry});
            }

        });



        entries.forEach((entry) => {
            let x = entry[x_key];
            let y = entry[y_key];

            x_min = Math.min(x_min, x);
            y_min = Math.min(y_min, y);

            x_max = Math.max(x_max, x);
            y_max = Math.max(y_max, y);

            data.push({x, y, color: ROAST_COLORS[entry.roast]});
        });

        // fixed min/max cases
        if(x_key == "extraction" || x_key == "strength") {
            x_min  = -1;
            x_max = 1;
        }

        if(y_key == "extraction" || y_key == "strength") {
            y_min = -1;
            y_max = 1;
        }

        if(y_key == "overall_rating") {
            y_min  = 1;
            y_max = 10;
        }


        let y_range = y_max - y_min;
        let x_range = x_max - x_min;

        let x_min_label = x_min.toFixed(2);
        let x_max_label = x_max.toFixed(2);
        let y_min_label = y_min.toFixed(2);
        let y_max_label = y_max.toFixed(2);

        x_min -= (x_range * .2);
        y_min -= (y_range * .2);

        x_max += (x_range * .2);
        y_max += (y_range * .2);

        
        y_range = y_max - y_min;
        x_range = x_max - x_min;

        
        let gridlines  = [1, 2, 3, 4, 5, 6, 7];

        let x_label = LABEL_MAP[x_key].label + "  (" + LABEL_MAP[x_key].units + ")";
        let y_label = LABEL_MAP[y_key].label + "  (" + LABEL_MAP[y_key].units + ")";


        // special format for date labels
        if(x_key == "date") {
            x_min_label = moment(x_min).format("MM-DD-YYYY");
            x_max_label = moment(x_max).format("MM-DD-YYYY");
            
        }
        if(y_key == "date") {
            y_min_label = moment(y_min).format("MM-DD-YYYY");
            y_max_label = moment(y_max).format("MM-DD-YYYY");
        }

        return(
            <View style={{marginTop: 20}}>
                <View style={{flexDirection: "row"}}>

                    {/* y-axis labels */}
                    <View style={{height, flexDirection: "row"}}>
                        
                        <View style={{justifyContent: "space-between", alignItems: "flex-end", paddingRight: 6, width: 40}}>
                            <Text style={{color: BROWN_PRIMARY}}>{(y_max_label)}</Text>
                            <Text style={{fontWeight: "bold",width: 200, textAlign: "center",color: BROWN_PRIMARY, transform: [{ rotate: '270deg'}, {translateY: 80}]}}>{y_label}</Text>
                            <Text style={{color: BROWN_PRIMARY}}>{(y_min_label)}</Text>
                        </View>
                    </View>

                    {/* data */}
                    <View>
                        <View style={{ height, width, position: "relative", backgroundColor: "#eee", borderColor: "#ddd", borderWidth: 1}}>

                            {/* gridlines */}
                            {gridlines.map((line) => <View style={{
                                position: "absolute", 
                                top: ((line/8) * 100) + "%", 
                                left: 0, right: 0, 
                                height: 1, 
                                backgroundColor: "#ddd"
                            }} /> )}

                            {gridlines.map((line) => <View style={{
                                position: "absolute", 
                                left: ((line/8) * 100) + "%", 
                                top: 0, bottom: 0, 
                                width: 1, 
                                backgroundColor: "#ddd"
                            }} /> )}

                            {/* data points */}
                            {data.map((d, i) => 
                                {

                                    let x_pct = ( (d.x - x_min) / x_range ) * 100;
                                    let  y_pct = ( (d.y - y_min) / y_range ) * 100;

                                   // console.log(x_pct, y_pct);

                                    return <View key={i} style={{
                                        position: "absolute",
                                        bottom: y_pct + "%",
                                        left: x_pct + "%",
                                    }}>

                                        <Icon type="font-awesome" name="coffee" size={20} color={d.color} containerStyle={{marginLeft: -5, marginTop: -5}} />
                                    </View>
                                }
                            
                            )}

                        </View>
                        {/* x-axis */}
                        <View style={{width}}>
                            <View style={{justifyContent: "space-between", flexDirection: "row"}}>
                                <Text style={{color: BROWN_PRIMARY}}>{(x_min_label)}</Text>
                                <Text style={{color: BROWN_PRIMARY}}>{(x_max_label)}</Text>
                            </View>
                            <View>
                                <Text style={{color: BROWN_PRIMARY, textAlign: "center", fontWeight: "bold"}}>{x_label}</Text>
                            </View>
                        </View>
                        
                    </View>
                </View>
            </View>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ScatterPlot);