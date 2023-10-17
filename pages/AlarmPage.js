import { ScrollView, Text, View, Pressable, Modal, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useState } from "react";
import FastClock from '../components/FastClock';
import ScheduledClock from "../components/ScheduledClock";
import { AddAlarm } from "../components/AddAlarm";
import notifee, { TriggerType } from '@notifee/react-native';

const AlarmPage = function () {

    const [modalVisible, setModalVisible] = useState(false);
    const [addBtnVisible, setAddBtnVisible] = useState(true);
    const [scheduledAlarms, setScheduledAlarms] = useState([{ fireDate: new Date(2023, 10, 15, 13, 14), notificationId: 1 }]);
    const [fastAlarms, setFastAlarms] = useState([new Date(2023, 10, 15, 9, 14)]);


    const hideModal = () => {
        setModalVisible(!modalVisible)
        setAddBtnVisible(true)
    }

    const addScheduled = async (date) => {
        setModalVisible(!modalVisible)
        setAddBtnVisible(true)
        // if (scheduledAlarms.some(alarm => alarm.fireDate.getTime() === date.getTime())) return

        await notifee.requestPermission();

        const trigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
        };

        // Create a trigger notification
        // await notifee.createTriggerNotification(
        //     {
        //         title: '闹钟来了',
        //         body: '快起床',
        //         ios: {
        //             sound: '../assets/sound/default_sound.wav'
        //         }

        //     },
        //     trigger,
        // );

        // Display a notification
       try{ await notifee.displayNotification({
            title: 'Notification Title',
            body: 'fuck',
            ios: {
                sound: '../assets/sound/default_sound.wav',
            }
        });} catch(e) {
            console.log(e);
        }
        setScheduledAlarms([...scheduledAlarms, { fireDate: date, notificationId: 1 }].sort((a, b) => a.fireDate - b.fireDate))
        Alert.alert('闹钟添加成功')
    }

    return <View className="bg-zinc-100 h-full relative">
        <ScrollView className="relative  bg-zinc-100">
            <Text className="mt-14 w-64 h-12 text-black text-4xl font-Jet-Bold">Fast Clock</Text>
            {fastAlarms.map((date, index) => <FastClock key={index} date={date} />)}
            <Text className="w-64 h-12 mt-4 text-black text-4xl font-Jet-Bold">Scheduled</Text>
            {scheduledAlarms.map((alarm, index) => <ScheduledClock key={index} date={alarm.fireDate} />)}
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