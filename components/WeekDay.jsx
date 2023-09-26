import { View, Text } from "react-native";

export default function WeekDay({ day, activated }) {

    return <>
        {activated ?
            <View className="w-9 h-9 bg-gray-1 rounded-full ml-1">
                <Text className="pt-2 text-xs font-Jet-Bold text-gray-2" > {day}</Text >
            </View > :
            <View className="w-9 h-9 bg-zinc-100 rounded-full ml-1">
                <Text className="text-center pt-2 text-xs font-Jet-Bold">{day}</Text>
            </View>
        }
    </>


}
