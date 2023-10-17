import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { SafeAreaView, Button, Text, StyleSheet, Pressable, View } from 'react-native';

export const AddAlarm = (props) => {
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
        <SafeAreaView style={styles.centeredView}>
            {/* <Pressable onPress={props.hideModal}> */}
                <View style={styles.modalView}>
                    {/* <Text>selected: {date.toLocaleString()}</Text> */}
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode='time'
                        is24Hour={true}
                        onChange={onChange}
                    />
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={()=>props.addScheduled(date)}
                    >
                        <Text style={styles.textStyle}>Add</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={props.hideModal}>
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable>
                </View>
            {/* </Pressable> */}
        </SafeAreaView>
        // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        // backgroundColor: 'rgba(0,0,0,0.5)',
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