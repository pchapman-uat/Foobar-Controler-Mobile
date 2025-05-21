import { Button, SafeAreaView, View, Text, ScrollView } from "react-native";
import { AppContext } from "../AppContext";
import { useContext, useState } from "react";
import PlayQueueResponse from "../classes/responses/PlayQueue";
import NavBarScreen from "../elements/NavBarScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { MainStyle } from "../style/MainStyle";

type PlaybackQueueNavigationProp = NativeStackNavigationProp<RootStackParamList, "PlaybackQueue">;

type Props = {
    navigation: PlaybackQueueNavigationProp
}
export default function PlaybackQueue({ navigation}: Props){
    const ctx = useContext(AppContext);
    const [playbackQueue, setPlaybackQueue] = useState<PlayQueueResponse>()
    const getPlaybackQueue = async () => {
        const response = await ctx.BeefWeb.getPlaybackQueue();
        setPlaybackQueue(response?.data);
    }

    const createPlayqueueList = (playQueue?: PlayQueueResponse) =>{
        if(!playQueue) {
            console.warn("Playqueue is empty");
            return;
        };
        const queueItems = playQueue.map((item, index) => {
            return (
                <View key={`queue-${index}`}>
                    <Text>{item.columns.title}</Text>
                </View>
            )
        })
        return (
            <View>
                {queueItems}
            </View>
             
        )
    }
    return (
        <NavBarScreen navigation={navigation}>

                <Button title="Get Queue" onPress={getPlaybackQueue}/>
                <ScrollView>
                    {createPlayqueueList(playbackQueue)}
                </ScrollView>
            
        </NavBarScreen>
    )
}