import { Button, SafeAreaView, View, Text } from "react-native";
import { AppContext } from "../AppContext";
import { useContext, useState } from "react";
import PlayQueueResponse from "../classes/responses/PlayQueue";

export default function PlaybackQueue(){
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
        <SafeAreaView>
            <Button title="Get Queue" onPress={getPlaybackQueue}/>
            {createPlayqueueList(playbackQueue)}
        </SafeAreaView>
    )
}