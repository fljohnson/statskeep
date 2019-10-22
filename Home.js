import React, {Component} from 'react';
import { FlatList, StyleSheet, Text, View,TouchableOpacity,Image, Alert } from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'lemon_db.db', createFromLocation : 1});

export class FlatListBasics extends Component {
		
	key = -1; //this will actually come from one of the list rows
	state = {
		editing: false,
	  };
	setEditing(visible) {
		this.setState({editing: visible});
	  }
	  onDoneEditing = () => {
		  this.setEditing(false);
	  };
clickHandler = () => {
    //function to handle click on floating Action Button
    //Alert.alert('Floating Button Clicked');
    this.key ++;
   this.setEditing(true);
  };
  
  static navigationOptions = {
    title: 'Stats',
  };
  
  
  render() {
	  
    const {navigate} = this.props.navigation;
     /*
        Special thanks to Snehal Agarwal (https://aboutreact.com/react-native-floating-action-button/)
        for cutting through the crazy-talk and non-functional code regarding the Floating Action Button 
        */

    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'Devin'},
            {key: 'Dan'},
            {key: 'Dominic'},
            {key: 'Jackson'},
            {key: 'James'},
            {key: 'Joel'},
            {key: 'John'},
            {key: 'Jillian'},
            {key: 'Jimmy'},
            {key: 'Julie'},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.push('Line', {keya: -1})}
          style={styles.TouchableOpacityStyle}>
          <Image
            //We are making FAB using TouchableOpacity with an image
            //We are using online image here
             source={{
uri:'https://raw.githubusercontent.com/AboutReact/sampleresource/master/plus_icon.png',
            }}
            //You can use you project image Example below
            //source={require('./images/float-add-icon.png')}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 28,
    height: 54,
  },
  
  
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
 
  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
    //backgroundColor:'black'
  },
})
