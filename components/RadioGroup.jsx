import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RadioButton from './RadioButton';

export default function RadioGroup({
    groupName,
    data = [],
    changeRadioGroup, // funkcja wywoływana przy zmianie, np. (newValue) => { ... }
    color,
    columns = 1,
    initialValue = null,
}) {
    const [selected, setSelected] = useState(initialValue);

    useEffect(() => {
        setSelected(initialValue);
    }, [initialValue]);

    const onSelect = (value) => {
        setSelected(value);
        if (changeRadioGroup) {
            changeRadioGroup(value);
        }
    };

    const rows = [];
    for (let i = 0; i < data.length; i += columns) {
        rows.push(data.slice(i, i + columns));
    }

    return (
        <View style={styles.container}>
            {groupName && <Text style={styles.groupName}>{groupName}</Text>}
            {rows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((item, index) => {
                        const value = item;
                        return (
                            <RadioButton
                                key={index}
                                label={value.toString()}
                                selected={selected === value}
                                onPress={() => onSelect(value)}
                                color={color}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    groupName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
