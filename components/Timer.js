import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {millisecondsToHuman} from '../utils/TimerUtils';
import TimerButton from './TimerButton';

export default class Timer extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    elapsed: PropTypes.number.isRequired,
    isRunning: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onRemovePress: PropTypes.func.isRequired,
    onStartPress: PropTypes.func.isRequired,
    onStopPress: PropTypes.func.isRequired,
  };

  handleDeleteTimer = () => {
    const {id, onRemovePress} = this.props;
    onRemovePress(id);
  };

  handleStartPress = () => {
    const {id, onStartPress} = this.props;
    onStartPress(id);
  };
  handleStopPress = () => {
    const {id, onStopPress} = this.props;
    onStopPress(id);
  };

  actionButton = () => {
    const {id, isRunning} = this.props;

    if (!isRunning) {
      return (
        <TimerButton
          color="#21BA45"
          title="Start"
          onPress={this.handleStartPress}
        />
      );
    } else {
      return (
        <TimerButton
          color="#DB2828"
          title="Stop"
          onPress={this.handleStopPress}
        />
      );
    }
  };

  render() {
    const {title, project, elapsed, onEditPress} = this.props;
    const elapsedString = millisecondsToHuman(elapsed);
    return (
      <View style={styles.timerContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{project}</Text>
        <Text style={styles.elapsedTime}>{elapsedString}</Text>
        <View style={styles.buttonGroup}>
          <TimerButton color="blue" small onPress={onEditPress} title="Edit" />
          <TimerButton
            color="blue"
            small
            onPress={this.handleDeleteTimer}
            title="Remove"
          />
        </View>
        {this.actionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: 'white',
    borderColor: '#d6d7da',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 0,
  },
  text: {
    color: '#767D92',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#767D92',
  },
  elapsedTime: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
    color: '#767D92',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
