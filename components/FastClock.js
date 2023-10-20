import { Text, View } from "react-native";
import { useState, useEffect } from "react";

const FastClock = function ({ date,deleteFast,uuid }) {
    const [leftminute, setLeftminute] = useState(parseInt((date.getTime() - Date.now()) / (60 * 1000) + 1));

    useEffect(() => {
        const timerId = setInterval(() => {
            if (date.getTime() <= Date.now()) {
                setLeftminute(0)
                clearInterval(timerId);
                deleteFast(uuid)
            }
            else
                setLeftminute(parseInt((date.getTime() - Date.now()) / (60 * 1000) + 1))
        }, 10000);
    }, []);

    useEffect(() => {
        setLeftminute(parseInt((date.getTime() - Date.now()) / (60 * 1000)+1));
    }, [date])

    let formatMinute = date.getMinutes();
    if (formatMinute < 10) formatMinute = `0${formatMinute}`;

    return (
        <View className=" w-full h-32 relative border-b-2 border-black bg-gray-2">
            <Text className=" left-6 top-6 h-16 absolute pt-1 text-black text-6xl font-Jet-Regular">{`${date.getHours()}:${formatMinute}`}</Text>
            <View className="right-4 bottom-3 absolute ">
                <Text className="text-black text-xl font-Jet-Regular">{`${leftminute} min`}</Text>
                <Text className="text-black text-xl font-Jet-Regular">left</Text>
            </View>
        </View>
    )
}

export default FastClock;