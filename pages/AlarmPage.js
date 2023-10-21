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
import { storeData, getData } from "../helper/data_persistent";

const AlarmPage = function () {
    const [modalVisible, setModalVisible] = useState(false);
    const [addBtnVisible, setAddBtnVisible] = useState(true);
    const [scheduledAlarms, setScheduledAlarms] = useState([]);
    const [fastAlarms, setFastAlarms] = useState([]);
    const [modalMode, setModalMode] = useState('fast') // ['fast', 'scheduled'
    const [state, setState] = React.useState({ open: false });

    // notifee.cancelAllNotifications()

    React.useEffect(() => {
        getData('scheduledAlarms').then((data) => {
            if (data !== null) {
                console.log(data[0]);
                setScheduledAlarms(data)
            }
        })
        getData('fastAlarms').then((data) => {
            if (data !== null) {
                setFastAlarms(data)
                // console.log(data[0]);
            }
        })
    }, [])


    const onStateChange = ({ open }) => setState({ open });

    const { open } = state;

    const hideModal = () => {
        setModalVisible(!modalVisible)
        setAddBtnVisible(true)
    }

    const updateScheduledAlarms = (uuid, newNotificationID, mode, ifCanceled) => {
        let newAlarms = []
        if (ifCanceled) {
            newAlarms = scheduledAlarms.map(alarm => {
                if (alarm.uuid === uuid) {
                    alarm.ifCanceled = true
                }
                return alarm
            })
        }
        else if (mode === 'next') {
            newAlarms = scheduledAlarms.map(alarm => {
                if (alarm.uuid === uuid) {
                    alarm.nxtNotificationID = newNotificationID
                    alarm.mode = mode
                    alarm.ifCanceled = ifCanceled
                }
                return alarm
            }).sort((a, b) => a.fireDate - b.fireDate)
        }
        else {
            // TODO: week mode
            console.log('updateScheduledAlarms mode is ' + mode)
        }

        setScheduledAlarms(newAlarms)
        storeData('scheduledAlarms', newAlarms)
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
            timestamp: newDate.getTime(),
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
        const newAlarms = [...scheduledAlarms, { fireDate: newDate.getTime(), mode: 'next', ifCanceled: false, uuid: uuid.v4(), nxtNotificationID: createdID }].sort((a, b) => a.fireDate - b.fireDate)
        setScheduledAlarms(newAlarms)
        storeData('scheduledAlarms', newAlarms)
    }

    const addFast = async (addminutes) => {
        if (addminutes === 0) return
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

        const newAlarms = [...fastAlarms, { uuid: uuid.v4(), fireDate: firedate.getTime(), notificationID: createdID }].sort((a, b) => a.fireDate - b.fireDate)
        setFastAlarms(newAlarms)
        storeData('fastAlarms', newAlarms)
    }

    const deleteScheduled = (uuid, mode) => {
        if (mode === 'next') {
            notifee.cancelNotification(scheduledAlarms.find(alarm => alarm.uuid === uuid).nxtNotificationID)
            const newAlarms = scheduledAlarms.filter(alarm => alarm.uuid !== uuid)
            setScheduledAlarms(newAlarms)
            storeData('scheduledAlarms', newAlarms)
        }
    }
    // 用户左滑删除
    const deleteFast = (uuid) => {
        notifee.cancelNotification(fastAlarms.find(alarm => alarm.uuid === uuid).notificationID)
        const newAlarms = fastAlarms.filter(alarm => alarm.uuid !== uuid)
        setFastAlarms(newAlarms)
        storeData('fastAlarms', newAlarms)
    }
    // 到点后自动撤销fast
    const removeFast = (uuid) => {
        const newAlarms = fastAlarms.filter(alarm => alarm.uuid !== uuid)
        setFastAlarms(newAlarms)
        storeData('fastAlarms', newAlarms)
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
                <Swipeable renderRightActions={renderRightActions} onSwipeableOpen={() => deleteScheduled(alarm.uuid, alarm.mode)} key={alarm.uuid}>
                    <ScheduledClock key={alarm.uuid} date={alarm.fireDate} nxtNotificationID={alarm.nxtNotificationID} uuid={alarm.uuid} mode={alarm.mode} updateScheduledAlarms={updateScheduledAlarms} ifCanceled={alarm.ifCanceled} />
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