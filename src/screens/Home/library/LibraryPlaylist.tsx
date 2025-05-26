import { useContext, useEffect, useState } from "react";
import {ScrollView, TextInput, View} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AppContext } from "AppContext";
import { Columns } from "classes/responses/Player";
import LibraryItems, {filterSongs} from "elements/LibraryItems";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import ThemeContext from "ThemeContext";

export default function LibraryPlaylist(){
    const Styles = useStyles('Main')
    const {theme} = useContext(ThemeContext)
    const [playlistId, setPlaylistId] = useState<string>()
    const [searchInput, setSearchInput] = useState<string>()
    const [songs, setSongs] = useState<Columns[]>()
    const [filteredSongs, setfilteredSongs] = useState<Columns[]>()
    const ctx = useContext(AppContext);
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
    useEffect(() => {
        const fetchPlaylists = async () => {
            const res = await ctx.BeefWeb.getPlaylists();
            if (res && res.data) {
                setPlaylists(res.data);
            }
        };
        fetchPlaylists();
    }, []);

    const searchSongs = (text: string) => {
        setfilteredSongs(filterSongs(text, songs))
    }
    

    return (
        <View style={{flex: 1}}>
            <Picker
                selectedValue={playlistId}
                onValueChange={(itemValue) => onPlaylistChange(itemValue)}
                dropdownIconColor={getColor(theme, 'textPrimary')}
                style={Styles.Main.picker}
            >
                {playlists.map((item) => (
                    <Picker.Item key={item.id} label={item.title} value={item.id} />
                ))}
            </Picker>
            <TextInput style={Styles.Main.textInput} onChangeText={searchSongs} value={searchInput}/>
            <ScrollView>{LibraryItems(playlistId, filteredSongs)}</ScrollView>
        </View>
            
    )
}