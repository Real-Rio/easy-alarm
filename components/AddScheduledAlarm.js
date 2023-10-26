import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet, Pressable, View } from 'react-native';

export const AddScheduledAlarm = (props) => {
    let curDate = new Date(Date.now());
    curDate.setMilliseconds(0);
    curDate.setSeconds(0);
    const [date, setDate] = useState(curDate);


    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    return (
        // <SafeAreaView>
        <TouchableOpacity activeOpacity={1} style={styles.centeredView} onPress={props.hideModal}>
            <Pressable>
                <View style={styles.modalView}>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode='time'
                        is24Hour={true}
                        onChange={onChange}
                    />
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        className="mt-5"
                        onPress={() => props.addScheduled(date)}
                    >
                        <Text style={styles.textStyle}>Add</Text>
                    </Pressable>
                </View>
            </Pressable>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'transparent',
    },
    modalView: {
        margin: 20,
        // position: 'absolute',
        // right: 0,
        // bottom: 0,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // backgroundColor: '#1F1F1F',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        margin: 2,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});