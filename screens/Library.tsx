import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { StyleManager } from "../style/StyleManager";
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
        return songs.map((item, index) => {
            return (
                <View key={index}>
                    <Text>{item.title}</Text>
                </View>
            )
        })
    }
    return (
        <View>
            <TextInput style={{width: '100%', borderWidth: 1, color:'red'}} onChangeText={setPlaylistId} keyboardType='number-pad' value={playlistId}></TextInput>
            <Button title="Search" onPress={onSearch}/>
            <ScrollView>{displaySongs(songs)}</ScrollView>
        </View>
    )
}