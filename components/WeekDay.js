import { View, Text, Pressable } from "react-native";
import { useState } from 'react';

export default function WeekDay({ day, activated }) {
    const [curState, setCurState] = useState(activated)

    return <Pressable onPress={()=>setCurState(!curState)}>
        <View className={` w-9 h-9 ${curState ? 'bg-gray-1' : 'bg-zinc-100'} rounded-full ml-1`}>
            <Text className={`relative right-[1px] pt-2 text-xs font-Jet-Bold ${curState ? 'text-gray-2' : ''}`} > {day}</Text >
        </View >
    </Pressable>


}

{/* <>
        {activated ?
            <View className="w-9 h-9 bg-gray-1 rounded-full ml-1">
                <Text className="pt-2 text-xs font-Jet-Bold text-gray-2" > {day}</Text >
            </View > :
            <View className="w-9 h-9 bg-zinc-100 rounded-full ml-1">
                <Text className="pt-2 text-xs font-Jet-Bold">{day}</Text>
            </View>
        }
    </> */}