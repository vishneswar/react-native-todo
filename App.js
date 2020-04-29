import * as React from 'react';
import { Platform, StyleSheet, Text, View , Button, ScrollView, TouchableOpacity} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('UserDatabase.db');

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

export default class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
        tasks : []
      }

      
  }


  componentDidMount () {
    db.transaction( tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS taskdetails (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT);",
        );
      });

        db.transaction( tx => {
          tx.executeSql(
            "SELECT task FROM taskdetails WHERE id=1;", 
            [],
            (_, { rows }) => {
              const str = JSON.parse(rows.item(0)['task'])
              this.setState({
                tasks: str,
              }) 
            }
            );
          });
     }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>tasker</Text>
        <ScrollView>
          <View style={styles.detailsView}>
            <Text style={styles.h1}>{this.state.tasks.length}</Text>
            <Text style={styles.h2}>Tasks for today</Text>
            <Text style={styles.h3}>2 tasks done</Text>
          </View>

          
            {this.state.tasks.map( (task, index) => {
          
            return (
              <View key={index}>
                <Text style={styles.tasklist}>{task.task}</Text> 
                <TouchableOpacity onPress={() => this.completed(index)} style={styles.completeButton}>
                </TouchableOpacity>
              </View> 
              )
            })}
          

        </ScrollView>

        <TouchableOpacity onPress={this.addTask} style={styles.addButton}>
          <Text style={styles.addBtn}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  addTask = () => {
    const task = {task: 'buy chineese food', isCompleted: false}
    const  tasks = [...this.state.tasks, task]
    this.setState({
      tasks
    })
    this.updateDb();
  }

  completed = (index) => {
    this.setState(() => {
      const tasks = [...this.state.tasks];
      tasks.splice(index, 1);
      return {
          tasks
      };
    })
    this.updateDb();
  }

  updateDb = () => {
    db.transaction( tx => {
    tx.executeSql(
      "UPDATE taskdetails SET task = ? WHERE id=1;", 
      [JSON.stringify(this.state.tasks)],
      );
    });
  }
}

//alignItems: 'center',
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 26,
  },
  welcome: {
    fontSize: 30,
    color: '#EA7773',
    marginTop: 20,
    paddingLeft: 20,
    paddingBottom:10,
    width: 370,
  },
  detailsView: {
    padding: 20,
    paddingBottom: 30,
  },
  h1: {
    fontSize: 90,
    color: '#EA7773',
    fontWeight: 'bold'
  },
  h2: {
    fontSize: 40,
    color: '#0A79DF',
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    color: '#8395A7',
    paddingLeft: 10,
  },
  tasklist: {
    fontSize: 20,
    paddingLeft: 50,
    paddingRight: 20,
    paddingTop: 2,
    marginBottom: 20,
    color: '#758AA2',
    borderBottomWidth: 1,
    borderColor: '#DAE0E2',
    paddingBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '600',  
  },
  completeButton: {
    borderColor: '#777E8B',
    borderWidth: 1,
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'flex-end',
    position: 'absolute',
    marginLeft: 25,
  },
  addButton: {
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    padding: 5,
    paddingRight: 25,
    paddingBottom: 15,
    alignSelf: 'flex-end',
  },
  addBtn : {
    textAlign: 'center',
    fontSize: 30,
    borderWidth: 1,
    width: 70,
    height: 70,
    borderRadius: 70,
    paddingTop: 15,
    borderColor: '#EA7773',
    color: '#EA7773',
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  
});
