import { Text, View, Switch } from "react-native";
import WeekDisplays from "./WeekDisplays";
import { useEffect, useState } from "react";
import notifee, {  TriggerType,RepeatFrequency } from '@notifee/react-native';
import { idText } from "typescript";

const ScheduledClock = function ({ date, nxtNotificationID, uuid, mode, updateScheduledAlarms, ifCanceled }) {
    const [isEnabled, setIsEnabled] = useState(!ifCanceled);
    const [weekActivated, setWeekActivated] = useState([false, false, false, false, false, false, false]);
    const [curChangeWeekDay, setCurChangeWeekDay] = useState(-1);
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    useEffect(() => {
        // console.log(curChangeWeekDay)
        async function createTrigger(trigger) {
            return await notifee.createTriggerNotification(
                {
                    title: '闹钟来了',
                    body: '快起床',
                    ios: {
                        sound: 'default_sound.wav'
                    }

                },
                trigger
            )
        }

        async function cancelTrigger(ID) {
            return await notifee.cancelNotification(ID)
        }
            

        if (mode === 'next' && weekActivated[curChangeWeekDay]) {
            const newDate = new Date(date);
            const daysUntilNextWeek = (curChangeWeekDay - newDate.getDay() + 8) % 7
            newDate.setDate(newDate.getDate() + daysUntilNextWeek)
            console.log(daysUntilNextWeek);

            // 取消原来的闹钟
            cancelTrigger(nxtNotificationID)

            const trigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: newDate.getTime(),
                repeatFrequency: RepeatFrequency.WEEKLY
            }

            createTrigger(trigger).then((ID) => {
                updateScheduledAlarms(uuid, null, 'week', false,{[weekdays[curChangeWeekDay]]:ID})
            })


        }


    }, [weekActivated])

    const updateNoticationID = async (mode) => {
        if (mode === 'next') {
            let newDate = date;
            // TODO：不一定只加24小时
            if (date < Date.now()) {
                const gapDays = parseInt((Date.now() - date) / (24 * 60 * 60 * 1000))
                newDate = new Date(date + gapDays*24 * 60 * 60 * 1000).getTime()
            }
            if (date < Date.now()) 
                newDate = new Date(newDate + 24 * 60 * 60 * 1000).getTime()

            const trigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: newDate,
            };


            return await notifee.createTriggerNotification(
                {
                    title: '闹钟来了',
                    body: '快起床',
                    ios: {
                        sound: 'default_sound.wav'
                    }

                },
                trigger
            )
        }

    }


    const toggleSwitch = async () => {
        setIsEnabled(previousState => !previousState);
        if (isEnabled) {
            console.log('准备取消闹钟');
            console.log(nxtNotificationID);
            if (mode === 'next') // 取消下一个闹钟
                notifee.cancelNotification(nxtNotificationID)
            else {
                // TODO:取消所有闹钟
            }
            updateScheduledAlarms(uuid, null, null, true)
        }
        else {
            console.log('准备添加闹钟');
            if (mode === 'next')
                updateNoticationID(mode).then((ID) => {
                    console.log('添加的ID:' + ID)
                    // setCurNotificationID(ID)
                    updateScheduledAlarms(uuid, ID, 'next', false)
                })
            else {
                // TODO
            }


        }

    }

    let formatMinute = new Date(date).getMinutes();
    if (formatMinute < 10) formatMinute = `0${formatMinute}`;

    return (
        <View className=" w-full h-32 relative border-b-2 border-black bg-gray-2">

            <Text className=" left-6 top-6 h-16 absolute pt-1 text-black text-6xl font-Jet-Regular">{`${new Date(date).getHours()}:${formatMinute}`}</Text>
            {/* <Text className=" left-6 top-6 h-16 absolute pt-1 text-black text-6xl font-Jet-Regular">{`${curNotificationID}`}</Text> */}

            <Switch
                trackColor={{ false: '#3e3e3e', true: '#f4f3f4' }}
                thumbColor={isEnabled ? '#3e3e3e' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                className="absolute right-4 top-12"
            />
            <WeekDisplays activated={weekActivated} setActivated={setWeekActivated} setCurChangeWeekDay={setCurChangeWeekDay} />
        </View>
    )
}

export default ScheduledClock