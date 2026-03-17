import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MyButton from '../components/MyButton';
import IconButton from '../components/IconButton';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';

export default function MainScreen({ navigation }) {
    useEffect(() => {
        NavigationBar.setBackgroundColorAsync('black');
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            <View style={styles.buttonRow}>
                <IconButton
                    iconName="image-outline"
                    onPress={() => navigation.navigate('GalleryScreen')}
                    size={80}
                    color="#080A0D"
                />
                <IconButton
                    iconName="camera-outline"
                    onPress={() => navigation.navigate('CameraScreen')}
                    size={80}
                    color="#080A0D"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '60%',
    },
});