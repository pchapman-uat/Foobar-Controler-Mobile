import { Button, SafeAreaView, View, Text, ScrollView, Modal, TouchableOpacity } from "react-native";
import { AppContext } from "../AppContext";
import { use, useContext, useState } from "react";
import PlayQueueResponse from "../classes/responses/PlayQueue";
import NavBarScreen from "../elements/NavBarScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { MainStyle, ModalStyle } from "../managers/StyleManager";
import { Columns } from "../classes/responses/Player";

type PlaybackQueueNavigationProp = NativeStackNavigationProp<RootStackParamList, "PlaybackQueue">;

type Props = {
    navigation: PlaybackQueueNavigationProp
}
export default function PlaybackQueue({ navigation}: Props){
    const ctx = useContext(AppContext);
    const [playbackQueue, setPlaybackQueue] = useState<PlayQueueResponse>()
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSong, setSelectedSong] = useState<Columns | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [selectedPlaylist, setSelectedPlaylist] = useState<string>()

    const getPlaybackQueue = async () => {
        const response = await ctx.BeefWeb.getPlaybackQueue();
        setPlaybackQueue(response?.data);
    }

    const createPlayqueueList = (playQueue?: PlayQueueResponse) =>{
        if(!playQueue) {
            console.warn("Playqueue is empty");
            return;
        };
        const handleLongPress = (song: Columns, index:number, playlistID:string) => {
            setSelectedSong(song);
            setSelectedIndex(index)
            setSelectedPlaylist(playlistID)
            setModalVisible(true);
        };
        const removeSong = () => {
            if(selectedSong == null || selectedPlaylist == null || selectedIndex == null){
                console.log(selectedSong?.trackNumber,selectedPlaylist,selectedIndex)
                console.warn("No Song Selected");
                return;
            }
            ctx.BeefWeb.removeFromQueue(selectedPlaylist, selectedSong.trackNumber, selectedIndex)
            setModalVisible(false);
            getPlaybackQueue();
        }
        return (
            <View>
                <View>
                    {playQueue.map((item, index) => (
                    <TouchableOpacity key={`queue-${index}`} onLongPress={() => handleLongPress(item.columns, index, item.playlistId)}>
                        <Text>{item.columns.title}</Text>
                    </TouchableOpacity>
                    )
                )}
                </View>
                <Modal
                    transparent
                    visible={modalVisible}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}>
                    <TouchableOpacity style={ModalStyle.modalOverlay} onPress={() => setModalVisible(false)}>
                        <View style={ModalStyle.menu}>
                            <TouchableOpacity onPress={() => removeSong()}>
                                <Text style={ModalStyle.menuItem}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
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