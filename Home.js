import React, {Component} from 'react';
import { FlatList, StyleSheet, Text, View,TouchableOpacity,Image, Alert,Dimensions,Button,DrawerLayoutAndroid,Modal, Switch } from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'lemon_db.db', createFromLocation : 1});
var datatypes = [
	{
		name:"Blood Glucose",
		decimal_places:0
	},
	{
		name:"Food Log",
		decimal_places:-1
	},
	{
		name:"Weight",
		decimal_places:1
	},
];

export class FlatListBasics extends Component {
		
	key = -1; //this will actually come from one of the list rows
	state = {
		editing: false,
			goods: [],
		filter: {
			from:new Date(),
			to:new Date(),
			types:[],
			useFrom:false,
			useTo:false,
			useType:[true,true,true]
		},
		filterModalVisible:false
		
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
  
  didBlurSubscription = this.props.navigation.addListener(
  'willFocus',
  payload => {
    this.do_fetch(null,null,null);
  }
);

do_fetch = (when_start,when_end,what_type) => {
	db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM stats WHERE active=\'Y\' ORDER BY utc_timestamp',
        [],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len',len);
          if(len == 0)
          {
			  this.setState({goods:[]});
			  alert("No records found");
			  return;
		  }
		   var temp = [];
			for (let i = 0; i < results.rows.length; ++i) {
			  temp.push(results.rows.item(i));
			}
		  this.setState({
			  goods: temp
		  });
	  }
	  );
	  });
	  
	
}

constructor(props) {
	super(props);
  db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM stats WHERE active=\'Y\' ORDER BY utc_timestamp',
        [],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len',len);
          if(len == 0)
          {
			  this.setState({goods:[]});
			  alert("No records found");
			  return;
		  }
		   var temp = [];
			for (let i = 0; i < results.rows.length; ++i) {
			  temp.push(results.rows.item(i));
			}
			this.state = {
				editing: false,
					goods: temp
				
			  };
	  }
	  );
	  });	
}

	possibleNotesBtn = (item) => {
		if(item.notes) {
			
		return (
		<View style={styles.notesBtn}>
							<Button onPress={() => {
								Alert.alert("Notes",item.notes);
							}} title="Notes..." />
						</View>
					
		);
		}
	}
	
toggleDrawer = () => {
	if(!this.state.drawerOpen) {
		this.refs["thedrawer"].openDrawer();
		this.setState({
			drawerOpen:true
		});
	}
	else{
		this.refs["thedrawer"].closeDrawer();
		this.setState({
			drawerOpen:false
		});
	}
}
toggleFilterOnType = (newvalue,index) => {
	var nufilter = this.state.filter;
	nufilter.useType[index]=newvalue;
  this.setState({
	  filter:nufilter
  });
}

toggleFilterBeginDate = (newvalue) =>{
	var nufilter = this.state.filter;
	nufilter.useFrom = newvalue;
  this.setState({
	  filter:nufilter
  });
}

toggleFilterEndDate = (newvalue) =>{
	var nufilter = this.state.filter;
	nufilter.useTo = newvalue;
  this.setState({
	  filter:nufilter
  });
}


doFiltering = () => {
	console.log("Result:",this.state.filter);
	this.closeFilterDlg();
}

closeFilterDlg = () => {
	this.setState({
		filterModalVisible:false
	});
}

openFilterDlg = () => {
	this.refs["thedrawer"].closeDrawer();
	this.setState({
		drawerOpen:false,
		filterModalVisible:true
	});
}

/*
 <View style = {styles.Whenfirst}>
			  <Switch onValueChange={this.toggleFilterBeginDate} value={this.state.filter.useFrom} />
			</View>
			* 
or(var i=0;i<datatypes.length;i++) {
		typeswitches+=(
		<View style = {styles.filterRow}>
			<View style = {styles.Whenbtn}>
			  <Text>Errg</Text>
			</View>
		</View>
		);
	}
			*/	
				  
typeim = (n) => {
	return(
		<View style = {styles.filterRow}>
			<View style = {styles.Whenbtn}>
			  <Text>Errg{n}</Text>
			</View>
		</View>
	);
}				  
filterModalDlg() {
	var typeswitches=[];
	for(var i=0;i<datatypes.length;i++) {
		typeswitches.push(this.typeim(i));
	}
	
	return(
	<Modal
          animationType="slide"
          transparent={false}
          visible={this.state.filterModalVisible}
          >
		<View style={styles.filterDlg}>
			<View style = {styles.filterRow}>
				<View style = {styles.Whenfirst}>
				  <Switch onValueChange={this.toggleFilterEndDate} value={this.state.filter.useTo} />
				</View>
				<View style = {styles.Whenbtn}>
				  <Text>No later than:</Text>
				</View>							
				<View style = {styles.Whenbtn}>
				  <Button title={this.state.filter.to.toDateString()} />
				</View>
			</View>
			<View style = {styles.filterRow}>
				<View style = {styles.Whenfirst}>
				  <Switch onValueChange={this.toggleFilterBeginDate} value={this.state.filter.useFrom} />
				</View>
				<View style = {styles.Whenbtn}>
				  <Text>No earlier than:</Text>
				</View>							
				<View style = {styles.Whenbtn}>
				  <Button title={this.state.filter.from.toDateString()} />
				</View>
			</View>
			
			<View style = {styles.filterRow}>
				<View style = {styles.Whenbtn}>
				  <Text>Types:</Text>
				</View>
				<FlatList
					data={datatypes}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({item,index}) => {
					
					
					return (
			   <View style={styles.filterRow}>
			   <View style = {styles.Whenfirst}>
				  <Switch onValueChange={(newvalue) => this.toggleFilterOnType(newvalue,index)} value={this.state.filter.useType[index]} />
				</View>
				<View style = {styles.Whenbtn}>
				  <Text>{item.name}</Text>
				</View>
				</View>
				);
					}
			  }
					/>
          	
			</View>
			<View style={styles.filterRow}>
             <View style={styles.Savebtn}>
              <Button onPress={() => {
					this.doFiltering();
                }} title="Filter" />
               </View>
             <View style={styles.Cancelbtn}>
              <Button onPress={() => this.closeFilterDlg()} title="Cancel" />
              </View>
			</View>

		</View>
      </Modal>
      );
}
	
  render() {
	  
    const {navigate} = this.props.navigation;
    var navigationView = (
    <View style={{flex: 1, backgroundColor: '#fff' }}>
		
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.openFilterDlg()}>
		  <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Filter by date and/or type</Text>
		</TouchableOpacity>
		<View>
		  <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Export to CSV file</Text>
		</View>
    </View>
  );
     /*
        Special thanks to Snehal Agarwal (https://aboutreact.com/react-native-floating-action-button/)
        for cutting through the crazy-talk and non-functional code regarding the Floating Action Button 
        */

    return (
      <View style={styles.container}>
      {this.filterModalDlg()}
      <View style={styles.mubutton}>
      <Button title="Info" onPress={() => this.toggleDrawer()} />
      </View>
      
    <DrawerLayoutAndroid
    ref={"thedrawer"}
      drawerWidth={200}
      drawerPosition={"left"}
      renderNavigationView={() => navigationView}>
        <FlatList
          data={this.state.goods}
          keyExtractor={(item, index) => item.id.toString()}
         
          renderItem={({item}) => {
			  var whatday = new Date(item.utc_timestamp*1000);
			  var value = item.val;
			  var valstyle = styles.itemValue;
			  if(item.statistic == "Food Log") {
				  value = "(see notes)";
				  valstyle = styles.seeNotes;
			  }
			  var localhrs = whatday.getHours();
			  var meridiem = " AM";
			  if(localhrs >= 12) {
				  meridiem = " PM";
			  }
			  if(localhrs > 12) {
				  localhrs = localhrs - 12;
			  }
			  var options = {
				  hour: '2-digit',
				  minute: '2-digit',
				  hour12: true
				};
				var timeString = ("0"+localhrs).substr(-2, 2)+":"+("0"+whatday.getMinutes()).substr(-2, 2)+meridiem;
			  var friendly = whatday.toLocaleDateString()+"\r\n "+timeString;
			  return (
			   <View style={styles.listItem}>
				<TouchableOpacity style={styles.sureListItems}
					onPress={() => this.props.navigation.push('Line', {keya: item.id})}
				>
					<Text style={styles.itemDate}>{friendly}</Text>
					<Text style={styles.itemType}>{item.statistic}</Text>
					<Text style={valstyle}>{value}</Text>
				</TouchableOpacity>
				{this.possibleNotesBtn(item)}
				</View>
				)
			  }
			  }
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
        
    </DrawerLayoutAndroid>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22,
  },
  listItem: {
	textAlignVertical:'center',
    maxWidth: Dimensions.get('window').width,
    flex:1,
   flexDirection: 'row',
   justifyContent:'flex-start',
    backgroundColor: '#fff',
    marginBottom: 10,
},
sureListItems: {
	flex:1,
   flexDirection: 'row',
   justifyContent:'flex-start',
},
  itemDate: {
	textAlignVertical:'center',
    marginRight: 3,
    fontSize: 18,
    height: 54,
  },
  
  itemType: {
	textAlignVertical:'center',
    marginLeft: 5,
    marginRight: 5,
    fontSize: 18,
    height: 54,
  },
  itemValue: {
	textAlignVertical:'center',
    marginLeft: 5,
    marginRight: 5,
    fontSize: 18,
    height: 54,
  },
  seeNotes: {
	textAlignVertical:'center',
    marginLeft: 5,
    marginRight: 5,
    fontSize: 12,
    fontStyle:"italic",
    height: 54,
  },
  notesBtn: {
	  marginLeft:10,
	  marginTop:9,
},
  mubutton: {
	  width:54
  }
  ,
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
	Whenfirst: {
		marginRight:10,
		marginTop:4
	},
	Whenbtn: {
		marginLeft:10,
		marginTop:4
	},
	filterDlg: {
		flexDirection:'column',
		flex:1,
		justifyContent:'center',
		marginLeft:4,
		marginRight:4
	},
	filterRow: {
		flexDirection:'row',
		justifyContent:'space-between'
	},
})
