import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import BackgroundJob from 'react-native-background-actions';
import {useNetInfo} from "@react-native-community/netinfo";


const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const taskRandom = async taskData => {
  await new Promise(async resolve => {
    // For loop with a delay
    const {delay} = taskData;
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log('Runned -> ', i);
      await BackgroundJob.updateNotification({taskDesc:'Presioname! Runned -> ' + i + 's'});
      await sleep(delay);
    }
  });
};

const App = () => {
  const {isConnected, isInternetReachable} = useNetInfo();
  const [playing, setPalying] = React.useState(!BackgroundJob.isRunning()) 

  React.useEffect(() => {
    toggleBackground()
  }, [isConnected])

  const options = {
    taskName: 'Example',
    taskTitle: 'Tarea',
    taskDesc: 'Presioname!',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    progressBar: {
      max: 100,
      value: 0,
      indeterminate: true,
    },
    color: 'aliceblue',
    linkingURI: 'https://github.com/waraps',
    parameters: {
      delay: 1000,
    },
  };
  
  const toggleBackground = async () => {
    setPalying(!playing)
    if (playing && isConnected) {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(taskRandom, options);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundJob.stop();
    }
  };
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {/* {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )} */}
          <View style={styles.body}>
            <TouchableOpacity
              style={{height: 100, width: 100, backgroundColor: 'red', borderRadius: 4,}}
              onPress={toggleBackground}></TouchableOpacity>
              <Text style={{ padding: 4, width: 300}}>Presione el boton para ejecutar la tarea, si deseas detenerla vuelvelo a presionar o desconectate de internet</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    flexDirection: 'row'
  },
});

export default App;
