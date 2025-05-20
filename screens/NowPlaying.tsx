import { View, Text, Button } from "react-native";
import { StyleManager as SM } from "../style/StyleManager";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useContext, useState } from "react";
import { AppContext } from "../AppContext";


type NowPlayingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NowPlaying'>;

type Props = {
    navigation: NowPlayingNavigationProp
}

export default function NowPlaying({ navigation }: Props){
    const ctx = useContext(AppContext);

    const [album, setAlbum] = useState("")
    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")

    const onUpdate = async () => {
        const response = await ctx.BeefWeb.getPlayer();
        if(response){
            const activeItem = response.data.activeItem;
            const columns = activeItem.columns;
            setAlbum(columns.album);
            setArtist(columns.artist);
            setTitle(columns.title);
        }
    }

    return (
        <View style={SM.Main.container}>
            <Text> Now Playing</Text>
            <View style={SM.NP.nowPlayingContainer}>
                <Text>{title}</Text>
                <Text>{artist}</Text>
                <Text>{album}</Text>
            </View>
            <Button title="Force Update" onPress={() => onUpdate()}></Button>
        </View>
    )
}