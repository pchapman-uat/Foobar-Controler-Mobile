import { useState, useContext, useEffect } from "react";
import AppContext from "AppContext";
import { Columns } from "classes/responses/Player";
import { View, Button, ScrollView, TextInput, Animated } from "react-native";
import LibraryItems, { filterSongs } from "elements/LibraryList";
import { useStyles } from "managers/StyleManager";
import LibraryGrid, { GridItem } from "elements/LibraryGrid";
import { Picker } from "@react-native-picker/picker";
import { getColor } from "managers/ThemeManager";
import LottieView from "lottie-react-native";
import updateColors, { LottieLoading } from "managers/LottiManager";
type Views = 'grid'|'list'
export default function LibraryArtist() {
    const Styles = useStyles('Main')
    const [searchInput, setSearchInput] = useState<string>()
    const ctx = useContext(AppContext);
    const [view, setView] = useState<Views>('grid')
    const [gridItems, setGridItems] = useState<GridItem[]>([]);
    const [songs, setSongs] = useState<Columns[]>()
    const [artist, setArtist] = useState<string>()
    const [filteredSongs, setfilteredSongs] = useState<Columns[]>([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const getAllSongs = async () => {
            setLoading(true)
            const {unique, songs} = await ctx.BeefWeb.getUniqueArtists();
            if(!unique) return;
            setGridItems(unique.map((item, i) => {return {
                id: i.toString(),
                title:item.artist,
                playlistId: item.playlistId,
                songIndex: item.songIndex
            }}))
            setSongs(songs)
            setLoading(false)
        }
        getAllSongs();
        }, []);
    const searchSongs = (text: string) => {
        setfilteredSongs(filterSongs(text, songs))
    }
    const onArtistChange = (artist: string) => {
        setArtist(artist)
        const newSongs = filterSongs(artist,songs, 'artist')
        console.log(newSongs)
        setfilteredSongs(newSongs)
        return newSongs;
    };
    const listView = (playlists: GridItem[], artist:string | undefined, filteredSongs:Columns[]|undefined) => {
        return(
            <View style={{flex: 1}}>
                <Picker
                    selectedValue={artist}
                    onValueChange={(itemValue) => onArtistChange(itemValue)}
                    dropdownIconColor={getColor(ctx.theme, 'textPrimary')}
                    style={Styles.Main.picker}
                >
                    {playlists.map((item) => (
                        <Picker.Item key={item.id} label={item.title} value={item.id} />
                    ))}
                </Picker>
                <TextInput style={Styles.Main.textInput} onChangeText={searchSongs} value={searchInput}/>
                <ScrollView><LibraryItems songs={filteredSongs} /></ScrollView>
            </View>
        )
    }
    type GetViewProps = {
        view: Views, 
        playlists: GridItem[], 
        artist?: string, 
        filteredSongs?:Columns[]
    }

    
    const GetView = ({view, playlists, artist, filteredSongs}:GetViewProps) => {
        const onGridPress = (item: GridItem) => {
            onArtistChange(item.title)
            setView('list')
        }
        const playAll = async (item: GridItem) => {
            const newSongs = onArtistChange(item.title)
            await ctx.BeefWeb.addToMobilePlaylist(newSongs.map(item => item.path))
            console.log("Done!")
        }
        switch(view){
            case "grid":
                return <LibraryGrid onGridPress={onGridPress} BeefWeb={ctx.BeefWeb} items={playlists} actions={[{text: 'Play All', onPress: playAll}]}/>
            case "list":
                return listView(playlists, artist, filteredSongs)
        }
    }
     useEffect(() => {
        updateColors(LottieLoading, getColor(ctx.theme, 'buttonPrimary'))
    }, [ctx])
     return (
        <View>
            {loading && <LottieView source={LottieLoading} autoPlay loop style={{width: 100, height: 100}}/>}
            <GetView view={view} playlists={gridItems} artist={artist} filteredSongs={filteredSongs}/>
        </View>
        
    )
}