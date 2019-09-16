import React from 'react';

import {StyleSheet, View, ScrollView, Text} from 'react-native';
import uuid from 'uuid';
import AsyncStorage from '@react-native-community/async-storage';
import EditableTimer from './components/EditableTimer';
import ToggleableTimerForm from './components/ToggleableTimerForm';
import {newTimer} from './utils/TimerUtils';

export default class App extends React.Component {
  state = {
    timers: [],
  };

  loadTimers = async () => {
    let response = await AsyncStorage.getItem('timers');
    let timers = (await JSON.parse(response)) || [];
    this.setState({timers});
  };

  storeTimers = async () => {
    const {timers} = this.state;
    await AsyncStorage.setItem('timers', JSON.stringify(timers));
  };

  componentDidMount() {
    this.loadTimers();
    const timeInterval = 1000;

    this.intervalId = setInterval(() => {
      const {timers} = this.state;

      this.setState({
        timers: timers.map(timer => {
          const {elapsed, isRunning} = timer;

          return {
            ...timer,
            elapsed: isRunning ? elapsed + timeInterval : elapsed,
          };
        }),
      });
    }, timeInterval);
  }

  componentWillUnmount() {
    this.storeTimers();
    clearInterval(this.intervalId);
  }

  handleCreateFormSubmit = timer => {
    const {timers} = this.state;

    this.setState({
      timers: [newTimer(timer), ...timers],
    });
    this.storeTimers();
  };

  handleFormSubmit = attrs => {
    const {timers} = this.state;

    this.setState({
      timers: timers.map(timer => {
        if (timer.id === attrs.id) {
          const {title, project} = attrs;

          return {
            ...timer,
            title,
            project,
          };
        }
        return timer;
      }),
    });
  };

  handleRemoveTimer = timerId => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId),
    });
  };

  toggleTimer = timerId => {
    this.setState(prevState => {
      const {timers} = prevState;

      return {
        timers: timers.map(timer => {
          const {id, isRunning} = timer;

          if (id === timerId) {
            return {
              ...timer,
              isRunning: !isRunning,
            };
          }
          return timer;
        }),
      };
    });
  };

  render() {
    const {timers} = this.state;
    return (
      <View style={styles.appContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Timers</Text>
        </View>

        <ScrollView style={styles.timerList}>
          <ToggleableTimerForm onFormSubmit={this.handleCreateFormSubmit} />
          {timers.map(({id, title, project, elapsed, isRunning}) => (
            <EditableTimer
              key={id}
              id={id}
              title={title}
              project={project}
              elapsed={elapsed}
              isRunning={isRunning}
              onFormSubmit={this.handleFormSubmit}
              onRemovePress={this.handleRemoveTimer}
              onStartPress={this.toggleTimer}
              onStopPress={this.toggleTimer}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  // timerListContainer: {
  //   flex: 1,
  // },
  titleContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333976',
  },
  timerList: {
    paddingBottom: 15,
  },
});
