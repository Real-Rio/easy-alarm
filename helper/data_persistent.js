import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
    try {
        console.log('store data');
        console.log(value);
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        // saving error
        console.log('store data error ' + e);
    }
};

const getData = async (key) => {
    try {
        console.log('get data');
        const jsonValue = await AsyncStorage.getItem(key);
        console.log(JSON.parse(jsonValue));
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        console.log('read data error ' + e);
    }
};

export { storeData, getData };