import { ScrollView, Text, View, Modal, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useState } from "react";
import FastClock from '../components/FastClock';
import ScheduledClock from "../components/ScheduledClock";
import { AddScheduledAlarm } from "../components/AddScheduledAlarm";
import { AddFastAlarm } from "../components/AddFastAlarm";
import notifee, { TriggerType } from '@notifee/react-native';
import * as React from 'react';
import { FAB, Portal, PaperProvider } from 'react-native-paper';
import uuid from 'react-native-uuid';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const AlarmPage = function () {
    const [sound, setSound] = React.useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [addBtnVisible, setAddBtnVisible] = useState(true);
    const [scheduledAlarms, setScheduledAlarms] = useState([]);
    const [fastAlarms, setFastAlarms] = useState([]);
    const [modalMode, setModalMode] = useState('fast') // ['fast', 'scheduled'
    const [state, setState] = React.useState({ open: false });

    // notifee.cancelAllNotifications()

    React.useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    const hideModal = () => {
        setModalVisible(!modalVisible)
        setAddBtnVisible(true)
    }

    const updateScheduledAlarms = (uuid, newDate) => {
        setScheduledAlarms(scheduledAlarms.map(alarm => {
            if (alarm.uuid === uuid) {
                alarm.fireDate = newDate
            }
            return alarm
        }).sort((a, b) => a.fireDate - b.fireDate))
    }


    const addScheduled = async (date) => {
        setModalVisible(!modalVisible)
        setAddBtnVisible(true)
        if (scheduledAlarms.some(alarm => alarm.fireDate.getTime() === date.getTime())) return

        await notifee.requestPermission();

        let newDate = date

        if (date.getTime() < Date.now())
            newDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)

        const trigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: newDate.getTime(), // fire at 11:10am (10 minutes before meeting)
        };

        // Create a trigger notification
        const createdID = await notifee.createTriggerNotification(
            {
                title: '闹钟来了',
                body: '快起床',
                ios: {
                    sound: 'default_sound.wav'
                }

            },
            trigger,
        );
        setScheduledAlarms([...scheduledAlarms, { fireDate: date, uuid: uuid.v4(), notificationIDs: [createdID] }].sort((a, b) => a.fireDate - b.fireDate))
    }

    const addFast = async (addminutes) => {
        if(addminutes===0) return
        setModalVisible(!modalVisible)
        setAddBtnVisible(true)
        const firedate = new Date(Date.now() + addminutes * 60 * 1000)
        firedate.setSeconds(0)
        const createdID = await notifee.createTriggerNotification(
            {
                title: '闹钟来了',
                body: '快起床',
                ios: {
                    sound: 'default_sound.wav'
                }

            },
            {
                type: TriggerType.TIMESTAMP,
                timestamp: firedate.getTime()
            },
        );
        setFastAlarms([...fastAlarms, { uuid: uuid.v4(), fireDate: firedate,notificationID:createdID }].sort((a, b) => a.fireDate - b.fireDate))

    }

    const deleteScheduled = (uuid) => {
        scheduledAlarms.find(alarm => alarm.uuid === uuid).notificationIDs.forEach(id => notifee.cancelNotification(id))
        setScheduledAlarms(scheduledAlarms.filter(alarm => alarm.uuid !== uuid))

    }
    // 用户左滑删除
    const deleteFast = (uuid) => {
        notifee.cancelNotification(fastAlarms.find(alarm => alarm.uuid === uuid).notificationID)
        setFastAlarms(fastAlarms.filter(alarm => alarm.uuid !== uuid))
        console.log('delete fast')
    }
    // 到点后自动撤销fast
    const removeFast = (uuid) => {
        setFastAlarms(fastAlarms.filter(alarm => alarm.uuid !== uuid))
    }

    const renderRightActions = () => {
        return (
            <View
                style={{
                    width: '100%',
                    backgroundColor: '#e01313',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                <Text
                    style={{
                        color: '#1b1a17',
                        paddingHorizontal: 10,
                        fontWeight: '600',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                    }}
                    className=" text-xl font-Jet-Regular"
                >
                    Delete
                </Text>
            </View>
        );
    };

    return <View className="bg-zinc-100 h-full relative">
        <ScrollView className="relative  bg-zinc-100">
            <Text className="mt-14 h-12 text-black text-4xl font-Jet-Bold">Fast Clock</Text>
            {fastAlarms.map((alarm) =>
                <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={() => deleteFast(alarm.uuid)} key={alarm.uuid}>
                    <FastClock deleteFast={removeFast} key={alarm.uuid} date={alarm.fireDate} uuid={alarm.uuid} />
                </Swipeable>
            )}
            <Text className=" h-12 mt-4 text-black text-4xl font-Jet-Bold">Scheduled Clock</Text>
            {scheduledAlarms.map((alarm) =>
                <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={() => deleteScheduled(alarm.uuid)} key={alarm.uuid}>
                    <ScheduledClock key={alarm.uuid} date={alarm.fireDate} notificationID={alarm.notificationId} uuid={alarm.uuid} />
                </Swipeable>
            )}
        </ScrollView>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
            {modalMode === 'fast' ? <AddFastAlarm hideModal={hideModal} addFast={addFast}></AddFastAlarm> : <AddScheduledAlarm hideModal={hideModal} addScheduled={addScheduled} />}
        </Modal >

        <PaperProvider>
            <Portal>
                <FAB.Group
                    open={open}
                    visible={addBtnVisible}
                    icon={'plus'}
                    backdropColor="#F0F0F0"
                    fabStyle={{ backgroundColor: '#33A2E9' }}
                    actions={[
                        {
                            icon: 'bell',
                            label: 'Fast Clock',
                            onPress: () => {
                                setModalVisible(!modalVisible)
                                setModalMode('fast')
                                setAddBtnVisible(false)
                            },
                            style: { backgroundColor: '#D5D5D5' },
                            color: '#363636',
                        },
                        {
                            icon: 'calendar-today',
                            label: 'Scheculed Clock',
                            onPress: () => {
                                setModalVisible(!modalVisible)
                                setModalMode('scheduled')
                                setAddBtnVisible(false)
                            },
                            style: { backgroundColor: '#D5D5D5' },

                            color: '#363636',
                        },
                    ]}
                    onStateChange={onStateChange}
                />
            </Portal>
        </PaperProvider>
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