import { useState, useContext } from "react";
import { AppContext } from "AppContext";
import { Columns } from "classes/responses/Player";
import { View, Button, ScrollView, TextInput } from "react-native";
import LibraryItems, { filterSongs } from "elements/LibraryList";
import { useStyles } from "managers/StyleManager";

export default function LibraryArtist() {
    const Styles = useStyles('Main')
    const [searchInput, setSearchInput] = useState<string>()
    const [songs, setSongs] = useState<Columns[]>()
    const [filteredSongs, setfilteredSongs] = useState<Columns[]>()
    const ctx = useContext(AppContext);
    const [playlists, setPlaylists] = useState<{ id: string; title: string }[]>([]);

    const getAllSongs = async () => {
        const uniqueSongs = await ctx.BeefWeb.getUniqueSongs();
        if(!uniqueSongs) return;
        setSongs(uniqueSongs)
        setfilteredSongs(uniqueSongs)
    }

    const searchSongs = (text: string) => {
        setfilteredSongs(filterSongs(text, songs))
    }
    return ( 
        <View style={{flex: 1}}>
            <Button title="Get All Songs" onPress={getAllSongs}/>
            <TextInput style={Styles.Main.textInput} onChangeText={searchSongs} value={searchInput}/>
            <ScrollView><LibraryItems songs={filteredSongs}/></ScrollView>
        </View>
    )
}