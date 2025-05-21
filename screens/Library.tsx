import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import { Button, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from "../App";
import { LibraryStyle } from "../style/StyleManager";

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
    const [playlists, setPlaylists] = useState<{ id: string; title: string }[]>([]);

    const onPlaylistChange = async (playlistID:string) => {
        setPlaylistId(playlistID)
        if(playlistId && playlistId != ""){
            console.log(playlistId)
            const response = await ctx.BeefWeb.getPlaylistItems(playlistID);
            if(response){
                setSongs(response.data.items)
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
    useEffect(() => {
        const fetchPlaylists = async () => {
            const res = await ctx.BeefWeb.getPlaylists();
            if (res && res.data) {
                setPlaylists(res.data);
            }
        };
        fetchPlaylists();
    }, []);

    return (
        <View>
            <Picker
                selectedValue={playlistId}
                onValueChange={(itemValue) => onPlaylistChange(itemValue)}
            >
                {playlists.map((item) => (
                    <Picker.Item key={item.id} label={item.title} value={item.id} />
                ))}
            </Picker>
            <ScrollView>{displaySongs(songs)}</ScrollView>
        </View>
    )
}