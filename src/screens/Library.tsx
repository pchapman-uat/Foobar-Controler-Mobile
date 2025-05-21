import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import { Button, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from "../App";
import { LibraryStyle, MainStyle } from "../managers/StyleManager";

import { AppContext } from "../AppContext";
import { Columns } from "../classes/responses/Player";
import NavBarScreen from "../elements/NavBarScreen";

type LibraryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Library'>;

type Props = {
    navigation: LibraryNavigationProp
}

export default function Library({ navigation}: Props){
    const [playlistId, setPlaylistId] = useState<string>()
    const [searchInput, setSearchInput] = useState<string>()
    const [songs, setSongs] = useState<Columns[]>()
    const [filteredSongs, setfilteredSongs] = useState<Columns[]>()
    const ctx = useContext(AppContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSong, setSelectedSong] = useState<Columns | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [playlists, setPlaylists] = useState<{ id: string; title: string }[]>([]);

    const onPlaylistChange = async (playlistID:string) => {
        setPlaylistId(playlistID)
        setSearchInput("")
        if(playlistId && playlistId != ""){
            console.log(playlistId)
            const response = await ctx.BeefWeb.getPlaylistItems(playlistID);
            if(response){
                console.log("Setting Songs")
                setSongs(response.data.items)
                setfilteredSongs(response.data.items)
            }
        }
    }
    const displaySongs = (songs?: Columns[]) => {
        
        if(!songs){
            console.warn("Songs are null")
            return;
        }

        const handleLongPress = (song: Columns, index:number) => {
            setSelectedSong(song);
            setSelectedIndex(index)
            setModalVisible(true);
        };
        const playSong = () => {
            if(!playlistId || !selectedIndex) return;
            ctx.BeefWeb.playSong(playlistId, selectedIndex)
            setModalVisible(false);
        }
        const queueSong = () => {
            if(!playlistId || !selectedIndex) return;
            ctx.BeefWeb.queueSong(playlistId, selectedIndex)
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


    const searchSong = (input: string) => {
        setSearchInput(input)
        if(!input || input == "" || !songs ) return;
        const regex = new RegExp(input, "i");

        const results = songs.filter(song => regex.test(song.title) || regex.test(song.album)  || regex.test(song.artist));
        setfilteredSongs(results);
    }

    return (
        <NavBarScreen navigation={navigation}>
            <Picker
                selectedValue={playlistId}
                onValueChange={(itemValue) => onPlaylistChange(itemValue)}
            >
                {playlists.map((item) => (
                    <Picker.Item key={item.id} label={item.title} value={item.id} />
                ))}
            </Picker>
            <TextInput style={MainStyle.textInput} onChangeText={searchSong} value={searchInput}/>
            <ScrollView>{displaySongs(filteredSongs)}</ScrollView>
        </NavBarScreen>
            
    )
}