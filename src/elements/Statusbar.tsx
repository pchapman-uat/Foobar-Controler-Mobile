import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { TouchableOpacity, View, Text } from "react-native";
import { Status } from "../classes/BeefWeb";
import { WebRequest } from "../classes/WebRequest";
import { PlayerResponse } from "../classes/responses/Player";
import { MenuSVG } from "../managers/SVGManager";
import { RootStackParamList } from "App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";

type StatusBarProps = {
    navigator: NativeStackNavigationProp<RootStackParamList, 'Home'>
}

const StatusBar: React.FC<StatusBarProps> = ({navigator}) => {
    const ctx = useContext(AppContext);
    const Style = useStyles('StatusBar')
    const [status, setStatus] = useState<Status>(Status.Offline)
    const [title, setTitle] = useState("");
    const [album, setAlbum] = useState("");
    const onUpdate = (request: WebRequest<PlayerResponse> | undefined) => {
        if(!request) return;
        console.log("Updating Status")
        setStatus(ctx.BeefWeb.status)
        const columns = request.data.activeItem.columns
        if(!columns) return;
        setTitle(columns.title)
        setAlbum(columns.album)
    }

    const getStatusColor = (status: Status) => {
        console.log(status)
        switch(status){
            case Status.Online:
                return 'green'
            case Status.Error:
                return 'red'
            case Status.Offline:
                return 'yellow'
        }
    }

    const forceUpdate = async () => {
        onUpdate(await ctx.BeefWeb.getPlayer())
    }

    useEffect(()=> {
       ctx.BeefWeb.addEventListener('update', async (e) => onUpdate(await e))
       forceUpdate();
    }, [])

    return (
        <View style={Style.StatusBar.StatusBarContainer}>
            <TouchableOpacity onPress={forceUpdate}>
                <View style={{...Style.StatusBar.StatusCircle, backgroundColor: getStatusColor(status)}}>
                </View>
            </TouchableOpacity>
            <Text style={Style.StatusBar.StatusText}>{title} - {album}</Text>
            <TouchableOpacity>
                <MenuSVG height={40} width={40} color={getColor(ctx.theme, 'textPrimary')} onPress={()=>navigator.navigate('Settings')}/>
            </TouchableOpacity>
        </View>
    )
}

export default StatusBar;