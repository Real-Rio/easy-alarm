import { Text, View, Switch } from "react-native";
import WeekDisplays from "./WeekDisplays";
import { useState } from "react";


const ScheduledClock = function ({date}) {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    let formatMinute = date.getMinutes();
    if (formatMinute < 10) formatMinute = `0${formatMinute}`;

    return (
        <View className=" w-full h-32 relative border-b-2 border-black bg-gray-2">

            <Text className=" left-6 top-6 h-16 absolute pt-1 text-black text-6xl font-Jet-Regular">{`${date.getHours()}:${formatMinute}`}</Text>
            {/* <Text className=" left-6 top-6 h-16 absolute pt-1 text-black text-6xl font-Jet-Regular">{`${date.getMonth()}:${date.getDate()}`}</Text> */}

            <Switch
                trackColor={{ false: '#3e3e3e', true: '#f4f3f4' }}
                thumbColor={isEnabled ? '#3e3e3e' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                className="absolute right-4 top-12"
            />
            <WeekDisplays />
        </View>
    )
}

export default ScheduledClock;