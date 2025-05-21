import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Button, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LibraryStyle } from "../style/StyleManager";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import { Columns } from "../classes/responses/Player";

type LibraryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Library'>;

type Props = {
    navigation: LibraryNavigationProp
}

export default function Library(){
    const [playlistId, setPlaylistId] = useState<string>()
    const [songs, setSongs] = useState<Columns[]>()
    const ctx = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSong, setSelectedSong] = useState<Columns | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>()

    const onSearch = async () => {
        if(playlistId && playlistId != ""){
            console.log(playlistId)
            try{
                const id = Number.parseInt(playlistId);
                console.log(id)
                if(id !=null){
                    const response = await ctx.BeefWeb.getPlaylistItems(id);
                    if(response){
                        setSongs(response.data.items)
                    }
                } else {
                    console.log("Invalid ID")
                }
            }
            catch {
                console.log("Failed to parse")
            }
        }
    }
    const displaySongs = (songs?: Columns[]) => {
        
        if(!songs) return null;

        const handleLongPress = (song: Columns, index:number) => {
            setSelectedSong(song);
            setSelectedIndex(index)
            setModalVisible(true);
        };
        const playSong = () => {
            if(!playlistId || !selectedIndex) return;
            const pref = Number.parseInt(playlistId)
            ctx.BeefWeb.playSong(pref, selectedIndex)
            setModalVisible(false);
        }
        const queueSong = () => {
            if(!playlistId || !selectedIndex) return;
            const pref = Number.parseInt(playlistId)
            console.log(pref, selectedIndex)
            ctx.BeefWeb.queueSong(pref, selectedIndex)
            setModalVisible(false);
        };
        return (
            <View>
                {songs.map((item, index) => (
                    <Pressable key={"song-" + index} onLongPress={() => handleLongPress(item, index)}>
                        <View>
                            <Text>{item.title}</Text>
                        </View>
                    </Pressable>
                ))}

                <Modal
                    transparent
                    visible={modalVisible}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity style={LibraryStyle.modalOverlay} onPress={() => setModalVisible(false)}>
                        <View style={LibraryStyle.menu}>
                            <TouchableOpacity onPress={() => playSong()}>
                                <Text style={LibraryStyle.menuItem}>Play</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => queueSong()}>
                                <Text style={LibraryStyle.menuItem}>Add to Playback Queue</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }
    return (
        <View>
            <TextInput style={{width: '100%', borderWidth: 1, color:'red'}} onChangeText={setPlaylistId} keyboardType='number-pad' value={playlistId}></TextInput>
            <Button title="Search" onPress={onSearch}/>
            <ScrollView>{displaySongs(songs)}</ScrollView>
        </View>
    )
}