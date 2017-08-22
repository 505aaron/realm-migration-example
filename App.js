import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import openConnection from './realm/default';
import sequencer from './realm/sequencer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { realm: null };
  }

  componentWillMount() {
    openConnection().then(realm => {
      sequencer(realm, 'Employee', {
          "name": "Sheryl Sandberg",
          "title": "COO"
      });
      this.setState({ realm });
    });;
  }

  render() {
    const info = this.state.realm
      ? 'Number of employees in this Realm: ' + this.state.realm.objects('Employee').length
      : 'Loading...';

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {info}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
