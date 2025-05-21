import React from "react"
import { TouchableOpacity, View } from "react-native"
import { SvgProps } from "react-native-svg";
import { useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../App";
import NavBarStyle from "../style/NavBarStyle";
import { ConnectionSVG, LibrarySVG, NowPlayingSVG, PlaceholderSVG, PlaybackQueueSVG} from '../managers/SVGManager'
type Icon = React.FC<SvgProps>
class NavBarItem {
    icon:Icon
    location:keyof RootStackParamList
    constructor(icon:Icon, location:keyof RootStackParamList){
        this.icon = icon;
        this.location = location;

    }
}
type NavBarProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, any>;
}

const NavBar: React.FC<NavBarProps> = ({navigation}) => {
    const route = useRoute()

    const items = [
        new NavBarItem(ConnectionSVG, "Connection"),
        new NavBarItem(LibrarySVG, "Library"),
        new NavBarItem(NowPlayingSVG, "NowPlaying"),
        new NavBarItem(PlaybackQueueSVG, "PlaybackQueue")
    ]
    
    const makeItems = () => {
        return items.map((item, index) =>
            (
                <TouchableOpacity key={`nav-${index}`} onPress={() => navigation.navigate(item.location)}>
                    <item.icon width={NavBarStyle.navBarItem.width} height={NavBarStyle.navBarItem.height} color={(route.name == item.location) ? 'black' : 'gray'}></item.icon>
                </TouchableOpacity>
            )
        )
    
    }
    return (
        <View style={NavBarStyle.navBarContainer}>
            {makeItems()}
        </View>
    )
}

export default NavBar;
