import React, { Component } from 'react';
import { connect } from 'react-redux';

import {View, Text, TouchableNativeFeedback, Keyboard} from 'react-native';
import {Icon, Input, ListItem} from 'react-native-elements';

import {BROWN_PRIMARY} from '../../Constants/Colors';
import { withRouter } from 'react-router-native';

import RoastControl from './RoastControl';
import GrindControl from './GrindControl';
import { ScrollView } from 'react-native';



const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({

});


class ComboBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show_suggestions: false,
            value: ""
        }

    
        this._handleTextChange = this._handleTextChange.bind(this);
        this._handleBlur = this._handleBlur.bind(this);
        this._handleFocus = this._handleFocus.bind(this);
        this._handleValueSelect = this._handleValueSelect.bind(this);

    }

    componentDidMount() {

    }

    _handleBlur() {
        this.setState({show_suggestions: false});
    }

    _handleFocus() {
        this.setState({show_suggestions: true});
    }

    _handleTextChange(text) {
        if(text.length > 0) {
            this.setState({show_suggestions: true});
        }
        else {
            this.setState({show_suggestions: false});
        }

        this.setState({value: text});

        if(this.props.onChange) {
            this.props.onChange(text);
        }
    }

    _handleValueSelect(value) { 

        this.setState({value});
        Keyboard.dismiss();

        if(this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {

        let values = this.props.data;
        let compare = this.state.value;

        let filtered = [];

        values.forEach((value => {

            if(value.includes(compare) || compare.length == 0) {

                filtered.push(value);
            }
        }));

        return(
            <View style={{height: 50, position: "relative", overflow: "visible", marginBottom: 30}}>
                <Input 
                    label={this.props.label}
                    labelStyle={{color: BROWN_PRIMARY, fontWeight: "normal", fontSize: 14, marginBottom: 5}}
                    inputContainerStyle={{backgroundColor: "#eee", borderColor: "#ddd", borderWidth: 1}}
                    onChangeText={this._handleTextChange} 
                    onBlur={this._handleBlur} 
                    onFocus={this._handleFocus}
                    value={this.state.value} 
                    defaultValue={this.props.defaultValue}
                />

                {this.state.show_suggestions && filtered.length > 0 && 
                    <View 
                        style={{
                            maxHeight: 200, 
                            width: "100%", 
                            backgroundColor: "#eee", 
                            position: "absolute", 
                            top: 55, left: 0, zIndex: 999, padding: 2
                        }}
                    >

                        <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="handled">

                            {filtered.map((value, i) => 
                            
                                <ListItem key={i} bottomDivider onPress={() => this._handleValueSelect(value)}>
                                    <ListItem.Content>
                                        <ListItem.Title>{value}</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            )}
                            
                        </ScrollView>
                    </View>
                }

            </View>
        );
    }
}


export default withRouter( connect(mapStateToProps, mapDispatchToProps)(ComboBox) );