import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ImgButton = ({ iconName, onPress, size = 30, color = "#fff", style }) => {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <Ionicons name={iconName} size={size} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#41A66C',
        padding: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});

export default ImgButton;
