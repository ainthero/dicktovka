import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Animated} from 'react-native';
import {Audio} from 'expo-av';
import quiet from "quietjs-bundle";

export default function TabTwoScreen() {
    const [recording, setRecording]: [Audio.Recording?, any?] = useState();
    const [text, setText] = useState('');

    const [receiver, setReceiver]: [ReturnType<typeof quiet.receiver>?, any?] = useState();
    const [promise, setPromise]: [Promise<string>?, any?] = useState();

    async function startRecording() {
        try {
            console.log("pawapepe gamabodi ")
            receiver?.destroy()
            setPromise(new Promise<string>(
                (resolve, reject) => {
                    setReceiver(quiet.receiver({
                        profile: "audible-fsk-robust",
                        onReceive: function (payload) {
                            resolve(quiet.ab2str(payload));
                        },
                        onReceiveFail: function (payload) {
                            resolve("Very bad bro")
                        },
                        onCreateFail: function (payload) {
                            resolve("Very bad bro " + payload)
                        }
                    }));
                }));

            console.log("pawapepe gamabodi ", promise)

            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const {recording} = await Audio.Recording.createAsync();
            setRecording(recording);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        setRecording(null);
        console.log(promise);
        await recording?.stopAndUnloadAsync();
        const uri = recording?.getURI();

        let result = await Promise.any([promise, new Promise<string>((resolve, reject) => {
            setTimeout(resolve.bind(null, "error timeout" + Math.random()), 1000)
        })]);
        setText(result ?? "Error");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab Two</Text>
            <View style={styles.separator}/>
            <TouchableOpacity
                onPressIn={startRecording}
                onPressOut={stopRecording}
                style={styles.button}
            >
                <Text>Hold for Recording</Text>
            </TouchableOpacity>
            {text ? <Text style={{...styles.recognizedText, color: "#ffffff"}}>{text}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    recognizedText: {
        marginTop: 20,
    },
});