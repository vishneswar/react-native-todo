import * as React from 'react';
import { Platform, StyleSheet, Text, View , Button, ScrollView} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>To Do application</Text>
      <ScrollView>
        <View style={styles.txttxt}><Text style={styles.txt}>Task 1</Text></View>
        <Text style={styles.txt}>Task 1</Text>
        <Text style={styles.txt}>Task 1</Text>
        <Text style={styles.txt}>Task 1</Text>
        <Text style={styles.txt}>Task 1</Text>
      </ScrollView>
      <View style={styles.input}>
      <TextInput />
      </View>
      
      <View style={styles.btnView}>
        <Button style={styles.btn} title="Add task"/>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 26,
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    marginTop: 20,
    paddingBottom:10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: 370,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  btn: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 3,
    borderColor: '#e7e7e7',
    width: 380,
    height: 50,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 10,
  },
  btnView: {
    paddingBottom: 10,
  },
  txt: {
    fontSize: 20,
    paddingBottom: 10,
  },
});
