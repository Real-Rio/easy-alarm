import { View, Text, Pressable } from "react-native";
import WeekDay from "./WeekDay";
import { useState } from "react";


export default function WeekDisplays({ activated, setActivated, setCurChangeWeekDay }) {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    // const states = [true, false, false, false, false, false, true]



    return <View className="absolute bottom-1">
        <View className=" w-full flex flex-row">
            {
                weekdays.map((day, index) => {
                    return <Pressable key={day} onPress={() => {
                        setActivated(activated.map((item, idx) => {
                            if (idx === index) return !item
                            else return item
                        }))
                        setCurChangeWeekDay(index)
                    }}>
                        <WeekDay day={day} activated={activated[index]} setActivated={setActivated} />
                    </Pressable>
                })
            }
        </View>
    </View>
}