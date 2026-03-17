import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

export default function FotoItem({ uri, width, height, isSelected }) {
    return (
        <View style={[styles.container, isSelected && styles.selected]}>
            <Image source={{ uri }} style={{ width, height }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        borderWidth: 3,
        borderColor: 'transparent'
    },
    selected: {
        borderColor: '#49BF7C',
        borderWidth: 3,
    }
});
