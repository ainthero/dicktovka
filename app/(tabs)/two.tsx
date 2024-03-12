import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, Animated} from 'react-native';
import {Audio} from 'expo-av';
import quiet from "quietjs-bundle";

export default function TabTwoScreen() {
    const [recording, setRecording]: [Audio.Recording | null | undefined, any] = useState();
    const [text, setText] = useState('');

    let receiver: ReturnType<typeof quiet.receiver> | null = null;
    let promise: Promise<string> | null = null;

    async function startRecording() {
        try {
            receiver?.destroy()
            promise = new Promise<string>(
                (resolve, reject) => {
                    receiver = quiet.receiver({
                        profile: "audible",
                        onReceive: function (payload) {
                            resolve(quiet.ab2str(payload));
                        }
                    });
                });

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
        await recording?.stopAndUnloadAsync();
        const uri = recording?.getURI();

        let result = await Promise.any([promise, new Promise<string>((resolve, reject) => {
            setTimeout(resolve.bind("Timeout"), 1000)
        })]);
        setText(result ?? "Error");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab Two</Text>
            <View style={styles.separator} />
            <TouchableOpacity
                onPressIn={startRecording}
                onPressOut={stopRecording}
                style={styles.button}
            >
                <Text>Hold for Recording</Text>
            </TouchableOpacity>
            {text ? <Text style={styles.recognizedText}>{text}</Text> : null}
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