import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import MapView, { Marker, UrlTile } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet, { BottomSheetView, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapPhotoItem from '../components/MapPhotoItem';

export default function MapScreen({ navigation }) {
    const [photos, setPhotos] = useState([]);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const bottomSheetRef = useRef(null);
    const webViewRef = useRef(null);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        const storedPhotos = await AsyncStorage.getItem('photos');
        if (storedPhotos) {
            const parsed = JSON.parse(storedPhotos);
            const withLocation = parsed.filter(p =>
                p != null &&
                typeof p.latitude === 'number' &&
                typeof p.longitude === 'number'
            );
            setPhotos(withLocation);
        }
    };

    useEffect(() => {
        if (webViewRef.current && photos.length > 0) {
            const grouped = {};
            photos.forEach(p => {
                const key = `${p.latitude.toFixed(4)},${p.longitude.toFixed(4)}`;
                if (!grouped[key]) {
                    grouped[key] = { latitude: p.latitude, longitude: p.longitude, count: 0 };
                }
                grouped[key].count++;
            });
            const points = Object.values(grouped);
            webViewRef.current.postMessage(JSON.stringify(points));
        }
    }, [photos]);

    const openPhoto = (photo) => {
        Image.getSize(photo.uri, (width, height) => {
            navigation.navigate('BigPhoto', {
                photo: { ...photo, width, height }
            });
        }, error => console.error("Error getting photo size:", error));
    };

    /* const handleMarkerPress = (latitude, longitude) => {
        const filteredPhotos = photos.filter(photo =>
            photo.latitude === latitude && photo.longitude === longitude
        );
        setSelectedPhotos(filteredPhotos);
        bottomSheetRef.current?.expand();
    }; */

    const handleMessage = (event) => {
        const { latitude, longitude } = JSON.parse(event.nativeEvent.data);
        const nearby = photos.filter(photo => {
            const key1 = `${photo.latitude.toFixed(4)},${photo.longitude.toFixed(4)}`;
            const key2 = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
            return key1 === key2;
        });
        setSelectedPhotos(nearby);
        bottomSheetRef.current?.expand();
    };

    const mapHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #080A0D; }
        #map { width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var map = L.map('map').setView([50.111, 20.111], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        var markers = [];

        // Odbieranie zdjęć
        document.addEventListener('message', function(e) {
            addMarkers(JSON.parse(e.data));
        });
        window.addEventListener('message', function(e) {
            addMarkers(JSON.parse(e.data));
        });

        function addMarkers(points) {
            markers.forEach(m => map.removeLayer(m));
            markers = [];

            points.forEach(function(point) {
                var marker = L.marker([point.latitude, point.longitude]);
                marker.on('click', function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        latitude: point.latitude,
                        longitude: point.longitude
                    }));
                });
                marker.addTo(map);
                markers.push(marker);
            });

            if (points.length > 0) {
                var group = L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.2));
            }
        }
    </script>
</body>
</html>
    `;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <WebView
                    ref={webViewRef}
                    source={{ html: mapHTML }}
                    style={styles.map}
                    onMessage={handleMessage}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    originWhitelist={['*']}
                />

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
