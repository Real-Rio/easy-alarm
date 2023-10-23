import { View, Text, Pressable } from "react-native";
import { useState } from 'react';

export default function WeekDay({ day, activated }) {
    // const [curState, setCurState] = useState(activated)

    return <View className={` w-9 h-9 ${activated ? 'bg-gray-1' : 'bg-zinc-100'} rounded-full ml-1`}>
            <Text className={`relative right-[1px] pt-2 text-xs font-Jet-Bold ${activated ? 'text-gray-2' : ''}`} > {day}</Text >
        </View >


}
