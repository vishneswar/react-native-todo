import * as React from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, Vibration} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { TextInput } from 'react-native-gesture-handler';
const db = SQLite.openDatabase('UserDatabase.db');

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

export default class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
        tasks : [],
        statusOfAdd: false,
        task: '',
        buttonFirstPress: true,
        completedTaskCounter: 0,
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

    var hours = new Date().getHours(); 
    var min = new Date().getMinutes();

     }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>tasker</Text>
        <ScrollView>
          <View style={styles.detailsView}>
            <Text style={styles.h1}>{this.state.tasks.length === 0 ? 'Add' : this.state.tasks.length}</Text>
            <Text style={styles.h2}>Tasks for today</Text>
            <Text style={styles.h3}><Text style={styles.h4}> {this.state.completedTaskCounter}</Text> tasks done</Text>
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
        {
          this.state.statusOfAdd ? 
          <View style={styles.addTaskView}>
          <TextInput style={styles.textInput} 
            value={this.state.task} 
            onChangeText={this.handleTextChanges} 
            autoFocus={true}
            />
          </View> : null
        }
        <TouchableOpacity onPress={this.addTask} style={styles.addButton}>
          <Text style={styles.addBtn}>+</Text>
        </TouchableOpacity>
        
      </View>
    );
  }


  handleTextChanges = task => {
     this.setState({task})
  }

  addTask = () => {
    Vibration.vibrate(40)
    if (this.state.buttonFirstPress){
      this.setState({
      statusOfAdd: true,
      buttonFirstPress: false,
    })
    } else if (this.state.task !== ''){
    const task = {task: this.state.task, isCompleted: false}
    const  tasks = [...this.state.tasks, task]
    this.setState({
      tasks,
      statusOfAdd: false,
      buttonFirstPress: true,
      task: ''
    })
    this.updateDb();
    } else {
      this.setState({
        statusOfAdd: false,
        buttonFirstPress: true,
      })
    } 
  }

  completed = (index) => {
    Vibration.vibrate(30)
    this.setState(() => {
      const tasks = [...this.state.tasks];
      tasks.splice(index, 1);
      return {
          tasks,
          completedTaskCounter: this.state.completedTaskCounter + 1
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
    fontSize: 15,
    color: '#8395A7',
    paddingLeft: 5,
  },
  h4: {
    fontWeight: 'bold',
    fontSize: 17,
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
  textInput: {
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 0,
    padding: 5,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    width: 280,
    backgroundColor: 'white',
    borderColor: '#EA7773',
    marginLeft: 10,
    marginBottom: 15,
    borderRadius: 30,
    height: 65,
    fontSize: 20,
  },
  addTaskView: {
    backgroundColor: 'white',
    height: 85,
  }
  
});
