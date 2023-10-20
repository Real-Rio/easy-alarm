import { useState } from 'react';
import { SafeAreaView, Button, Text, StyleSheet, Pressable, View } from 'react-native';
import { Chip, IconButton } from 'react-native-paper';


export const AddFastAlarm = (props) => {
    const [addMinutes, setAddMinutes] = useState(0);

    return (
        // <SafeAreaView>
        <SafeAreaView style={styles.centeredView}>
            <View style={styles.modalView}>
                {addMinutes < 60 ? <Text className="font-Jet-Bold text-xl">{`+${addMinutes}min`}</Text> : <Text className="font-Jet-Bold text-xl">{`+${parseInt(addMinutes / 60)}hr,${addMinutes % 60}min`}</Text>}
                <View className="flex-row flex-wrap justify-between">
                    <Chip style={styles.chipStyle} icon="information" onPress={() => setAddMinutes(addMinutes + 1)}>1 min</Chip>
                    <Chip style={styles.chipStyle} icon="information" onPress={() => setAddMinutes(addMinutes + 5)}>5 mins</Chip>
                    <Chip style={styles.chipStyle} icon="information" onPress={() => setAddMinutes(addMinutes + 10)}>10 mins</Chip>
                    <Chip style={styles.chipStyle} icon="information" onPress={() => setAddMinutes(addMinutes + 15)}>15 mins</Chip>
                    <Chip style={styles.chipStyle} icon="information" onPress={() => setAddMinutes(addMinutes + 30)}>30 mins</Chip>
                    <Chip style={styles.chipStyle} icon="information" onPress={() => setAddMinutes(addMinutes + 60)}>60 mins</Chip>

                </View>
                <View className="flex-row mt-5">
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setAddMinutes(0)}
                    >
                        <Text style={styles.textStyle}>Reset</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.addFast(addMinutes)}
                    >
                        <Text style={styles.textStyle}>Add</Text>
                    </Pressable>

                </View>
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
    },
    modalView: {
        margin: 2,
        width: '80%',
        // flexWrap: 'wrap',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
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
    chipStyle: {
        margin: 2,
        width: '47%',
    }
});