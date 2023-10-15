import { ScrollView, Text, View, Pressable, Modal, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import FastClock from '../components/FastClock';
import ScheduledClock from "../components/ScheduledClock";
import { AddAlarm } from "../components/AddAlarm";
const AlarmPage = function () {

    const [modalVisible, setModalVisible] = useState(false);
    const [addBtnVisible, setAddBtnVisible] = useState(true);
    const [scheduledAlarms, setScheduledAlarms] = useState([new Date(2023,10,15,13,14)]);
    const [fastAlarms,setFastAlarms] = useState([new Date(2023,10,15,9,14),new Date(2023,10,15,12,12)]);


    const hideModal = () => {
        setModalVisible(!modalVisible)
        setAddBtnVisible(true)
    }

    const addScheduled = (date) => {
        setModalVisible(!modalVisible)
        setAddBtnVisible(true)
        if(scheduledAlarms.includes(date)) return
        setScheduledAlarms([...scheduledAlarms, date].sort((a,b)=>a-b))
    }

    return (
        <View className="bg-zinc-100 h-full relative">
            <ScrollView className="relative  bg-zinc-100">
                <Text className="mt-14 w-64 h-12 text-black text-4xl font-Jet-Bold">Fast Clock</Text>
                {fastAlarms.map((date, index) => <FastClock key={index} date={date} />)}
                <Text className="w-64 h-12 mt-4 text-black text-4xl font-Jet-Bold">Scheduled</Text>
                {scheduledAlarms.map((date, index) => <ScheduledClock key={index} date={date} />)}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <AddAlarm hideModal={hideModal} addScheduled={addScheduled} />
            </Modal >
            {addBtnVisible && <Pressable
                onPress={() => {
                    setModalVisible(!modalVisible)
                    setAddBtnVisible(false)
                }}>
                <View className="absolute bottom-6 right-6 z-50 w-16 h-16  rounded-full ml-1 bg-blue-1">
                    <Text className=" text-center text-5xl leading-[60px] font-Jet-Bold" >+</Text >
                </View >
            </Pressable>}
        </View >
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        position: 'absolute',
        right: 0,
        bottom: 0,
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
    },
    button: {
        borderRadius: 20,
        padding: 10,
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

export default AlarmPage;