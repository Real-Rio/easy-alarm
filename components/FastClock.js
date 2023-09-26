import { Text, View } from "react-native";

const FastClock = function () {
    return (
        <View className=" w-full h-32 relative border-b-2 border-black bg-gray-2">
            {/* <View className="bg-blue-300"> */}

            <Text className=" left-6 top-6 h-16 absolute pt-1 text-black text-6xl font-Jet-Regular">12:03</Text>
            <View className="right-4 bottom-3 absolute ">
                <Text className="text-black text-xl font-Jet-Regular">20 mins</Text>
                <Text className="text-black text-xl font-Jet-Regular">left</Text>
            </View>
        </View>
    )
}

export default FastClock;