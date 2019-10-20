import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Button, Alert,Picker,TextInput} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
export class Entry extends Component {
  //TODO: add user-friendly date and time to this state
  state = {
    statdate: new Date(),
    mode: 'date',
    show: false,
    stattype: 'Blood Glucose',
    statvalue:'',
    notes:''
  }
    keya = -1;
	initDate = new Date();
	visible = false;
	onDoneEditing = () =>{
	};
  
  setDate = (event, date) => {
    date = date || this.state.statdate;
    var put = ""
    if(this.state.mode == "date") {
		put = date.toDateString()+" "+this.state.statdate.toTimeString();
	}
	if(this.state.mode == "time") {
		put = this.state.statdate.toDateString()+" "+date.toTimeString();
	}
	date = new Date(put);
    this.initDate = date
//TODO:set user-friendly date and time in this setState()
    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      statdate:date,
    });
  }
 
  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  }

  datepicker = () => {
    this.show('date');
  }

  timepicker = () => {
    this.show('time');
  }

saveData = () => {
	var row= "StatDate:"+this.state.statdate+"\r\n"+"StatType:"+this.state.stattype+"\r\n";
	row+="StatValue:"+this.state.statvalue+"\r\n"+"Comments:"+this.state.notes;
	alert(row);
}
gotVisible = () =>{
	//alert(this.props.keya);
	//we actualy fetch the record with that key value
	//and use setState() to populate
	this.initDate.setDate(this.initDate.getDate()-1);
	this.setState({
	date:this.initDate
});
}

onTypeChange = (itemValue, itemIndex) => {
    this.setState({stattype: itemValue});
}
onValChange = (text) => {
	this.setState({statvalue: text})
}
  
  render() {
    return (
        <Modal
          animationType="slide"
          transparent={false}
          visible = {this.props.visible}
          onShow = {this.gotVisible}
          >
          <View style={{marginTop: 22}}>
            <View>
              <Text>Hello World!</Text>
				
		<Picker
		  selectedValue={this.state.stattype}
		  style={{height: 50, width: 200}}
		  onValueChange={this.onTypeChange}>
		  <Picker.Item label="Blood Glucose" value="Blood Glucose"/>
		  <Picker.Item label="Weight"  value="Weight"/>
		</Picker>
		<TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={this.onValChange}
      value={this.state.statvalue}
      keyboardType="decimal-pad"
		/>


        <View>
          <Button onPress={this.datepicker} title={this.state.statdate.toDateString()} />
        </View>
         <View>
          <Button onPress={this.timepicker} title={this.state.statdate.toTimeString()} />
        </View>
        
        { this.state.show && <DateTimePicker value={this.state.statdate}
                    mode={this.state.mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate} />
        }

              <TouchableHighlight
                onPress={() => {
					this.saveData();
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
