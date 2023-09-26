import { ScrollView, Text, View } from "react-native";
import FastClock from '../components/FastClock';
import ScheduledClock from "../components/ScheduledClock";
const AlarmPage = function () {
    return (
        <ScrollView className=" h-full bg-zinc-100">
            <Text className="mt-14 w-64 h-12 text-black text-4xl font-Jet-Bold">Fast Clock</Text>
            <FastClock />
            <FastClock />
            <Text className="w-64 h-12 text-black text-4xl font-Jet-Bold">Scheduled</Text>
            <ScheduledClock />
            <ScheduledClock />
        </ScrollView>
    )
}

export default AlarmPage;