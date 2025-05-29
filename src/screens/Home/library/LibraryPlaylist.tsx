import { useContext, useEffect, useState } from "react";
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import { Picker } from '@react-native-picker/picker';
import AppContext from "AppContext";
import { Columns } from "classes/responses/Player";
import LibraryItems, {filterSongs} from "elements/LibraryList";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import LibraryGrid, { GridItem } from "elements/LibraryGrid";
import LottieView from "lottie-react-native";
import updateColors, { LottieLoading } from "managers/LottiManager";
type Views = 'grid'|'list'
export default function LibraryPlaylist(){
    const Styles = useStyles('Main', 'Library')
    const [playlistId, setPlaylistId] = useState<string>()
    const [searchInput, setSearchInput] = useState<string>()
    const [songs, setSongs] = useState<Columns[]>()
    const [filteredSongs, setfilteredSongs] = useState<Columns[]>([])
    const ctx = useContext(AppContext);
    const [playlists, setPlaylists] = useState<{ id: string; title: string }[]>([]);
    const [view, setView] = useState<Views>('grid')
    const [loading, setLoading] = useState(false)
    
    const onPlaylistChange = async (playlistID: string) => {
        setPlaylistId(playlistID);
        setSearchInput("");
        if (playlistID && playlistID !== "") {
            console.log(playlistID);
            const response = await ctx.BeefWeb.getPlaylistItems(playlistID);
            if (response) {
                console.log("Setting Songs");
                setSongs(response.data.items);
                setfilteredSongs(response.data.items);
            }
        }
    };

    useEffect(() => {
        const fetchPlaylists = async () => {
            setLoading(true)
            const res = await ctx.BeefWeb.getPlaylists();
            if (res && res.data) {
                setPlaylists(res.data);
            }
            setLoading(false)
        };
        fetchPlaylists();
    }, []);

    const searchSongs = (text: string) => {
        setfilteredSongs(filterSongs(text, songs))
    }
    
    const listView = (playlists: { id: string; title: string }[], playlistId:string | undefined, filteredSongs:Columns[]|undefined) => {
        return(
            <View style={{flex: 1}}>
                <Picker
                    selectedValue={playlistId}
                    onValueChange={(itemValue) => onPlaylistChange(itemValue)}
                    dropdownIconColor={getColor(ctx.theme, 'textPrimary')}
                    style={Styles.Main.picker}
                >
                    {playlists.map((item) => (
                        <Picker.Item key={item.id} label={item.title} value={item.id} />
                    ))}
                </Picker>
                <TextInput style={Styles.Main.textInput} onChangeText={searchSongs} value={searchInput}/>
                <ScrollView><LibraryItems playlistId={playlistId} songs={filteredSongs} /></ScrollView>
            </View>
        )
        
    }
    

    type GetViewProps = {
        view: Views, 
        playlists: GridItem[], 
        playlistId?: string, 
        filteredSongs?:Columns[]
    }
    const GetView = ({view, playlists, playlistId, filteredSongs}:GetViewProps) => {
        const onGridPress = (item: GridItem) => {
            onPlaylistChange(item.id);
            setView('list')
        }
        switch(view){
            case "grid":
                return <LibraryGrid onGridPress={onGridPress} BeefWeb={ctx.BeefWeb} items={playlists}/>
            case "list":
                return listView(playlists, playlistId, filteredSongs)
        }
    }
    useEffect(() => {
        updateColors(LottieLoading, getColor(ctx.theme, 'buttonPrimary'))
    }, [ctx])
    return (
        <View>
            {loading && <LottieView source={LottieLoading} autoPlay loop style={{width: 100, height: 100}}/>}
            <GetView view={view} playlists={playlists} playlistId={playlistId} filteredSongs={filteredSongs}/>
        </View>
        
    )
}