import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { TouchableOpacity, View, Text } from "react-native";
import { StatusBarStyle as SBS } from '../managers/StyleManager'
import { Status } from "../classes/BeefWeb";
type StatusBarProps = {

}

const StatusBar: React.FC<StatusBarProps> = () => {
    const ctx = useContext(AppContext);

    const [status, setStatus] = useState<Status>(Status.Offline)
    const [title, setTitle] = useState("");
    const [album, setAlbum] = useState("");

    const updateStatus = () => {
        console.log("Updating Status")
        setStatus(ctx.BeefWeb.status)
        const columns = ctx.BeefWeb.lastPlayer?.activeItem.columns
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

    useEffect(updateStatus)

    return (
        <View style={SBS.StatusBarContainer}>
            <TouchableOpacity onPress={updateStatus}>
                <View style={{...SBS.StatusCircle, backgroundColor: getStatusColor(status)}}>
                </View>
            </TouchableOpacity>
            <Text style={SBS.StatusText}>{title} - {album}</Text>
        </View>
    )
}

export default StatusBar;