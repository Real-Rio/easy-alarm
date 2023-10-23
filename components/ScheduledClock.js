import { Text, View, Switch } from "react-native";
import WeekDisplays from "./WeekDisplays";
import { useEffect, useState } from "react";
import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';

const ScheduledClock = function ({ date, nxtNotificationID, uuid, mode, updateScheduledAlarms, ifCanceled, week }) {
    const [isEnabled, setIsEnabled] = useState(!ifCanceled);
    const [weekActivated, setWeekActivated] = useState(Object.values(week).map((value) => value.selected));
    const [curChangeWeekDay, setCurChangeWeekDay] = useState(-1);
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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
        console.log('取消的ID： ' + ID)
        return await notifee.cancelNotification(ID)
    }

    useEffect(() => {
        if (mode === 'next' && weekActivated[curChangeWeekDay] && curChangeWeekDay !== -1) {
            // 取消原来的闹钟
            if (!ifCanceled) {
                const newDate = new Date(date);
                const daysUntilNextWeek = (curChangeWeekDay - newDate.getDay() + 8) % 7
                newDate.setDate(newDate.getDate() + daysUntilNextWeek)
                console.log('daysUntilNextWeek' + daysUntilNextWeek);

                cancelTrigger(nxtNotificationID)

                const trigger = {
                    type: TriggerType.TIMESTAMP,
                    timestamp: newDate.getTime(),
                    repeatFrequency: RepeatFrequency.WEEKLY
                }

                createTrigger(trigger).then((ID) => {
                    updateScheduledAlarms(uuid, null, 'week', false, { [weekdays[curChangeWeekDay]]: { id: ID, selected: true } })
                    console.log(ID);
                })
            }
            else { // 只改变selected和mode，不设置新的notification
                updateScheduledAlarms(uuid, null, 'week', true, { [weekdays[curChangeWeekDay]]: { id: null, selected: true } })

            }
        }

        else if (mode === 'week' && !weekActivated[curChangeWeekDay] && curChangeWeekDay !== -1) {
            // 将原来的周期闹钟删除
            if (!ifCanceled) {
                console.log('debug1: ' + week[weekdays[curChangeWeekDay]].id);
                const ID = week[weekdays[curChangeWeekDay]].id
                cancelTrigger(ID)
                if (weekActivated.every((value) => value === false)) {
                    updateNoticationID('next', null).then((ID) => {
                        console.log('转为next模式,添加的ID:' + ID)
                        updateScheduledAlarms(uuid, ID, 'next', false, { [weekdays[curChangeWeekDay]]: { id: null, selected: false } })

                    })
                }
                // 仅将对应星期的selected记为false
                else
                    updateScheduledAlarms(uuid, null, 'week', false, { [weekdays[curChangeWeekDay]]: { id: null, selected: false } })
            }
            else {
                if (weekActivated.every((value) => value === false)) {
                    console.log('week 2');
                    updateScheduledAlarms(uuid, null, 'next', true, { [weekdays[curChangeWeekDay]]: { id: null, selected: false } })
                }
                else {
                    console.log('week mode');
                    updateScheduledAlarms(uuid, null, 'week', true, { [weekdays[curChangeWeekDay]]: { id: null, selected: false } })
                }
            }

        }
        else if (mode === 'week' && weekActivated[curChangeWeekDay] && curChangeWeekDay !== -1) {
            if (!ifCanceled) {
                const newDate = new Date(date);
                const daysUntilNextWeek = (curChangeWeekDay - newDate.getDay() + 8) % 7
                newDate.setDate(newDate.getDate() + daysUntilNextWeek)

                const trigger = {
                    type: TriggerType.TIMESTAMP,
                    timestamp: newDate.getTime(),
                    repeatFrequency: RepeatFrequency.WEEKLY
                }

                createTrigger(trigger).then((ID) => {
                    updateScheduledAlarms(uuid, null, 'week', false, { [weekdays[curChangeWeekDay]]: { id: ID, selected: true } })
                    console.log('添加的week mode ID: ' + ID);
                })

            }
            else
                updateScheduledAlarms(uuid, null, 'week', true, { [weekdays[curChangeWeekDay]]: { id: null, selected: true } })
        }
        else {
            console.log('未命中,mode is '+mode+'curChangeWeekDay is '+curChangeWeekDay);
        }
    }, [weekActivated])


    // 用于toggle switch重新设置闹钟
    const updateNoticationID = async (mode, week) => {
        if (mode === 'next') {
            let newDate = date;
            // TODO：不一定只加24小时
            if (date < Date.now()) {
                const gapDays = parseInt((Date.now() - date) / (24 * 60 * 60 * 1000))
                newDate = new Date(date + gapDays * 24 * 60 * 60 * 1000).getTime()
            }
            if (date < Date.now())
                newDate = new Date(newDate + 24 * 60 * 60 * 1000).getTime()

            const trigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: newDate,
            };


            return await createTrigger(trigger)
        }
        else {
            let newWeek = {}
            for (let key in week) {
                if (week[key].selected) {
                    const newDate = new Date(date);
                    const daysUntilNextWeek = (weekdays.indexOf(key) - newDate.getDay() + 8) % 7
                    newDate.setDate(newDate.getDate() + daysUntilNextWeek)

                    const trigger = {
                        type: TriggerType.TIMESTAMP,
                        timestamp: newDate.getTime(),
                        repeatFrequency: RepeatFrequency.WEEKLY
                    }
                    createTrigger(trigger).then((ID) => {
                        newWeek[key] = { id: ID, selected: true }
                        console.log('添加的week mode ID: ' + ID + '星期：' + key)
                    })
                }
            }
            return newWeek
        }

    }

 // (uuid, newNotificationID, mode, ifCanceled, week)
    const toggleSwitch = async () => {
        setIsEnabled(previousState => !previousState);
        if (isEnabled) {
            console.log('准备取消闹钟');
            if (mode === 'next') {
                console.log(nxtNotificationID);
                notifee.cancelNotification(nxtNotificationID)
            updateScheduledAlarms(uuid, null, 'next', true, null)

            }
            else {
                for (let key in week) {
                    if (week[key].id !== null && week[key].selected)
                        notifee.cancelNotification(week[key].id)
                }
            updateScheduledAlarms(uuid, null, 'week', true, null)

            }
        }
        else {
            console.log('准备添加闹钟');
            if (mode === 'next')
                updateNoticationID('next', null).then((ID) => {
                    console.log('添加的ID:' + ID)
                    // 要修改，参数不全
                    updateScheduledAlarms(uuid, ID, 'next', false)
                })
            else {
                updateNoticationID('week', week).then((newWeek) => {
                    updateScheduledAlarms(uuid, null, 'week', false, newWeek)
                })
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