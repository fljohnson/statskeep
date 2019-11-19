
import SQLite from 'react-native-sqlite-storage';
import Alert  from 'react-native';
const database_name = "lemonwhiz.db";
const database_version = "1.0";
const database_displayname = "SQLite Test Database";
const database_size = 200000;

function openCB() {
  Database.db.transaction((tx) => {
							tx.executeSql(
							"CREATE TABLE `stats` ("+
							"`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
							"`utc_timestamp`	INTEGER NOT NULL,"+
							"`statistic`	TEXT NOT NULL,"+
							"`val`	TEXT NOT NULL,"+
							"`notes`	TEXT DEFAULT NULL,"+
							"`active`	INTEGER DEFAULT 'Y'"+
						")"
							);
							tx.executeSql(
							"CREATE INDEX `by_type` ON `stats` ("+
							"`utc_timestamp`	ASC,"+
							"`statistic`	ASC"+
						")"
							);
							tx.executeSql(
							"CREATE INDEX `by_present` ON `stats` ("+
							"`utc_timestamp`	ASC,"+
							"`active`	DESC"+
						")"
							)	;
						}
}
function errorCB(err) {
  Alert.alert("FALTA!",JSON.stringify(err));
}	
export class Database {
	//static db = SQLite.openDatabase({name : "testDB", createFromLocation : "~data/mydbfile.sqlite"}B);
	static db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size,openCB,errorCB); 


	
}
