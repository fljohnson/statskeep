import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Button, Alert,Picker,TextInput,StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'lemon_db.db', createFromLocation : 1});
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

	do_insert = (when_secs,stat_type,value,notes) => {
	db.transaction(function(tx) {
	tx.executeSql(
	  'INSERT INTO stats (utc_timestamp, statistic, val, notes) VALUES (?,?,?,?)',
	  [when_secs, stat_type, value,notes],
	  (tx, results) => {
		console.log('Results', results.rowsAffected);
		if (results.rowsAffected > 0) {
		  Alert.alert(
			'Success',
			'Added new record',
			[
			  {
				text: 'OK',
				onPress: () =>
                  this.props.onDoneEditing(),
				  //that.props.navigation.navigate('HomeScreen'),
			  },
			],
			{ cancelable: false }
		  );
		} else {
			console.log("Blew it:".results);
		  alert('Whiffed');
		}
	  }
	);
  });
}

saveData = () => {
	//JS Date().getTime() is in milliseconds (Un*x timestamps are in seconds) 
	//Both are based on "Jan 1, 1970, 00:00:00.000 GMT" - "start of the Un*x epoch"
	var row= "StatDate:"+this.state.statdate.getTime()+"\r\n"+"StatType:"+this.state.stattype+"\r\n";
	row+="StatValue:"+this.state.statvalue+"\r\n"+"Comments:"+this.state.notes;
	//now here, we need to yak at persistent storage
	var trunotes = null;
	if(this.state.notes != null && this.state.notes.length > 0) {
		trunotes = this.state.notes;
	}
	this.do_insert(Math.floor(this.state.statdate.getTime()/1000),
		this.state.stattype,this.state.statvalue,trunotes
	);
	
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
          <View style={styles.EntryDlg}>
            <View>
			<View style = {styles.Valrow}>
			<View  >
		<Picker
		  selectedValue={this.state.stattype}
		  style={{height: 50, width: 170}}
		  onValueChange={this.onTypeChange}>
		  <Picker.Item label="Blood Glucose" value="Blood Glucose"/>
		  <Picker.Item label="Food Log" value="Food Log"/>
		  <Picker.Item label="Weight"  value="Weight"/>
		</Picker>
		</View>
		<View>
		<TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={this.onValChange}
      value={this.state.statvalue}
      keyboardType="decimal-pad"
		/>
		</View>
		</View>


        <View style = {styles.Whenbtn}>
          <Button onPress={this.datepicker} title={this.state.statdate.toDateString()} />
        </View>
         <View style = {styles.Whenbtn}>
          <Button onPress={this.timepicker} title={this.state.statdate.toTimeString()} />
        </View>
        
        { this.state.show && <DateTimePicker value={this.state.statdate}
                    mode={this.state.mode}
                    is24Hour={false}
                    display="default"
                    onChange={this.setDate} />
        }
			<View style={styles.Valrow}>
             <View style={styles.Savebtn}>
              <Button onPress={() => {
					this.saveData();
                }} disabled={(this.state.statvalue.length == 0)} title="Save" />
               </View>
             <View style={styles.Cancelbtn}>
              <Button onPress={this.props.onDoneEditing} title="Cancel" />
              </View>
			</View>
            </View>
          </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
	EntryDlg: {
		flexDirection:'column',
		flex:1,
		justifyContent:'center',
		marginLeft:4,
		marginRight:4
	},
	Valrow: {
		flexDirection:'row',
		justifyContent:'center'
	},
	Whenbtn: {
		marginTop:4
	},
	Savebtn: {
		marginTop:4,
		flex:1,
		marginRight:2
	},
	Cancelbtn: {
		marginTop:4,
		flex:1,
		marginLeft:2
	}
});



