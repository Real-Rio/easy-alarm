import { View, Text } from "react-native";
import WeekDay from "./WeekDay";
export default function WeekDisplays() {
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const states = [true, false, false, false, false, false, true]
    return <View className="absolute bottom-1">
        <View className=" w-full flex flex-row">
            {
                weekdays.map((day,index) => {
                    return <WeekDay key={day} day={day} activated={states[index]} />
                })
            }
        </View>
    </View>
}