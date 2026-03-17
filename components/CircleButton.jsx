import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CircleButton({ iconName, onPress, btnwidth, btnheight, iconSize }) {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { width: btnwidth, height: btnheight }]}>
            <Ionicons name={iconName} size={iconSize} color="#49BF7C" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
