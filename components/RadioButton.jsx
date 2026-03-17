import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function RadioButton({ label, selected, onPress, color }) {
    return (
        <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
            <View style={[styles.radioOuter, { borderColor: color || '#007AFF' }]}>
                {selected && <View style={[styles.radioInner, { backgroundColor: color || '#007AFF' }]} />}
            </View>
            {label !== undefined && <Text style={styles.label}>{label}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 10,
    },
    radioOuter: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
        color: "#eee"
    },
});
