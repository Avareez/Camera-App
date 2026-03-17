import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapPhotoItem from '../components/MapPhotoItem';

export default function MapScreen({ navigation }) {
    const [photos, setPhotos] = useState([]);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const bottomSheetRef = useRef(null);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        const storedPhotos = await AsyncStorage.getItem('photos');
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        }
    };

    const openPhoto = (photo) => {
        Image.getSize(photo.uri, (width, height) => {
            navigation.navigate('BigPhoto', {
                photo: { ...photo, width, height }
            });
        }, error => console.error("Error getting photo size:", error));
    };

    const handleMarkerPress = (latitude, longitude) => {
        const filteredPhotos = photos.filter(photo =>
            photo.latitude === latitude && photo.longitude === longitude
        );
        setSelectedPhotos(filteredPhotos);
        bottomSheetRef.current?.expand();
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 50.111,
                        longitude: 20.111,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    {photos.map((photo, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: photo.latitude, longitude: photo.longitude }}
                            title="Photo"
                            description={`ID: ${photo.id ?? photo.timestamp ?? 'brak'}`}
                            onPress={() => handleMarkerPress(photo.latitude, photo.longitude)}
                        />
                    ))}
                </MapView>

                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1} // początkowo zamknięty
                    snapPoints={['25%', '50%']}
                    enablePanDownToClose={true}
                    enableContentPanningGesture={false} // Wyłącza przeciąganie zawartości
                    enableHandlePanningGesture={true} // Pozwala przeciągać uchwyt
                    handleComponent={() => (
                        <View style={styles.handleBarContainer}>
                            <View style={styles.handleBar} />
                        </View>
                    )}
                >
                    <BottomSheetView style={styles.sheetContainer}>
                        <Text style={styles.sheetTitle}>Photos found in this location</Text>
                        <BottomSheetFlatList
                            data={selectedPhotos}
                            horizontal
                            pagingEnabled
                            snapToAlignment="center"
                            snapToInterval={110}
                            decelerationRate="fast"
                            keyExtractor={(item, index) => `${item.uri}-${index}`}
                            contentContainerStyle={styles.flatListContent}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => openPhoto(item)}>
                                    <MapPhotoItem photo={item} openPhoto={openPhoto} />
                                </TouchableOpacity>
                            )}
                        />
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    sheetContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#080A0D',
    },
    sheetTitle: {
        fontWeight: 'bold',
        color: '#41A66C',
        fontSize: 16,
        marginBottom: 16,
    },
    handleBarContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#41A66C',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    handleBar: {
        width: 50,
        height: 5,
        backgroundColor: '#080A0D',
        borderRadius: 10,
    },
    flatListContent: {
        paddingHorizontal: 10,
    },
});
