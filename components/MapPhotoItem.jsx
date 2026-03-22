import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function MapPhotoItem({ photo, openPhoto }) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => openPhoto(photo)}>
            <Image source={{ uri: photo.uri }} style={styles.image} />
            <Text style={styles.coordsText}>
                Latitude/Longitude
            </Text>
            <Text style={styles.coords}>
                {photo.latitude.toFixed(4)}, {photo.longitude.toFixed(4)}
            </Text>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 5
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginBottom: 4
    },
    coords: {
        alignSelf: "center",
        color: '#eee',
        fontSize: 12,
    },
    coordsText: {
        color: '#eee',
        fontSize: 14,
        fontWeight: "bold",
        margin: 2
    }
});
