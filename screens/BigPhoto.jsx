import React from 'react';
import { View, Image, StyleSheet, Button, ToastAndroid, Text } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import MyButton from '../components/MyButton';

export default function BigPhoto({ route, navigation }) {
    const { photo } = route.params;

    const deletePhoto = async () => {
        try {
            await MediaLibrary.deleteAssetsAsync([photo.id]);
            ToastAndroid.showWithGravity(
                'Zdjęcie usunięte',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            navigation.goBack();
        } catch (error) {
            ToastAndroid.showWithGravity(
                'Błąd przy usuwaniu zdjęcia',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    };

    const sharePhoto = async () => {
        try {
            await Sharing.shareAsync(photo.uri);
        } catch (error) {
            ToastAndroid.showWithGravity(
                'Błąd przy udostępnianiu',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="cover" />

            <Text style={styles.resolutionText}>
                {photo.width} x {photo.height}
            </Text>

            <View style={styles.buttonRow}>
                <MyButton text="Delete" color="#49BF7C" txtcolor="#080A0D" onPress={deletePhoto} />
                <MyButton text="Share" color="#49BF7C" txtcolor="#080A0D" onPress={sharePhoto} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee"
    },
    image: {
        width: "100%",
        height: "100%"
    },
    buttonRow: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    resolutionText: {
        position: 'absolute',
        top: 30,
        left: 20,
        color: '#eee',
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5
    }
});
