import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';

export class Entry extends Component {
  
	visible = false;
	onDoneEditing = () =>{
	};
  

  render() {
    return (
        <Modal
          animationType="slide"
          transparent={false}
          visible = {this.props.visible}
          >
          <View style={{marginTop: 22}}>
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this.props.onDoneEditing();
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
    );
  }
}
