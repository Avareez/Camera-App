import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, FlatList, Button, ToastAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import FotoItem from '../components/FotoItem';
import MyButton from '../components/MyButton';

const { width } = Dimensions.get("window");

export default function GalleryScreen({ navigation }) {
    const [hasPermissions, setHasPermissions] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [numColumns, setNumColumns] = useState(3);
    const [selectedPhotos, setSelectedPhotos] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            setHasPermissions(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (hasPermissions) {
            loadPhotos();
        }
    }, [hasPermissions]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadPhotos();
            setSelectedPhotos([]);
        });
        return unsubscribe;
    }, [navigation]);

    const loadPhotos = async () => {
        try {
            const media = await MediaLibrary.getAssetsAsync({
                first: 1000,
                mediaType: ['photo'],
            });
            const sorted = media.assets.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
            setPhotos(sorted);
        } catch (error) {
            ToastAndroid.showWithGravity(
                'Błąd pobierania zdjęć',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    };

    const unselect = async () => {
        setSelectedPhotos([]);

    };

    const toggleSelect = (id) => {
        setSelectedPhotos(prev => {
            if (prev.includes(id)) {
                return prev.filter(photoId => photoId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const deleteSelected = async () => {
        if (selectedPhotos.length === 0) {
            ToastAndroid.showWithGravity(
                'Nie zaznaczono żadnych zdjęć',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            return;
        }
        try {
            await MediaLibrary.deleteAssetsAsync(selectedPhotos);
            ToastAndroid.showWithGravity(
                'Zdjęcia usunięte',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            setSelectedPhotos([]);
            loadPhotos();
        } catch (error) {
            ToastAndroid.showWithGravity(
                'Błąd przy usuwaniu zdjęć',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onLongPress={() => toggleSelect(item.id)}
            onPress={() => navigation.navigate('BigPhoto', { photo: item })}
        >
            <FotoItem
                uri={item.uri}
                width={(width / numColumns) - 19}
                height={(width / numColumns) - 19}
                isSelected={selectedPhotos.includes(item.id)}
            />
        </TouchableOpacity>
    );

    if (hasPermissions === null) {
        return (
            <View style={styles.center}>
                <Text>Sprawdzanie uprawnień...</Text>
            </View>
        );
    }
    if (!hasPermissions) {
        return (
            <View style={styles.center}>
                <Text>Brak uprawnień do galerii.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                <MyButton text="Grid/List" color="#49BF7C" txtcolor="#080A0D" onPress={() => setNumColumns(numColumns === 1 ? 3 : 1)} />
                <MyButton text="Unselect" color="#49BF7C" txtcolor="#080A0D" onPress={unselect} />
                <MyButton text="Delete Selected" color="#49BF7C" txtcolor="#080A0D" onPress={deleteSelected} />
            </View>
            <FlatList
                data={photos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                key={numColumns} // wymusza przeładowanie przy zmianie layoutu
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: "#eee"
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    list: {
        paddingBottom: 20
    }
});
