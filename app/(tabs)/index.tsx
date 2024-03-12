import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import Quiet from 'quietjs-bundle';

const TextToAudioTab = () => {
  const [text, setText] = useState('');

  const handleTextChange = (text: string) => {
    setText(text);
  };

  const handleTransform = () => {
      var tx = Quiet.transmitter({
          profile: 'audible-7k-channel-0', // 'ultrasonic' or other profiles depending on your requirement
          onFinish: () => {
              console.log('Transmission finished');
          }});
      tx.transmit(Quiet.str2ab(text));
  };

  return (
    <View style={styles.container}>
        <TextInput 
            style={styles.input} 
            onChangeText={handleTextChange}
            value={text} 
            placeholder="Enter text to convert"
        />
        <TouchableOpacity style={styles.button} onPress={handleTransform}>
            <Text style={styles.buttonText}>Transform</Text>
        </TouchableOpacity>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default TextToAudioTab;