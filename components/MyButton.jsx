import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const MyButton = ({ color, text, onPress, txtcolor }) => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
            <Text style={[styles.text, { color: txtcolor }]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        marginVertical: 8,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default MyButton;
