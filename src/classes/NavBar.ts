import { SvgProps } from "react-native-svg";
import { ConnectionSVG, LibrarySVG, NowPlayingSVG, PlaybackQueueSVG } from "../managers/SVGManager";
import Connection from "../screens/home/Connection";
import LibraryMain from "../screens/home/LibraryMain";
import NowPlaying from "../screens/home/NowPlaying";
import PlaybackQueue from "../screens/home/PlaybackQueue";

export type ScreenName = 'Connection' | 'NowPlaying' | 'Library' | 'PlaybackQueue';

type Icon = React.FC<SvgProps>;

class NavBarItem {
  icon: Icon;
  location: ScreenName;
  screen: () => React.JSX.Element
  constructor(icon: Icon, location: ScreenName, screen: () => React.JSX.Element ) {
    this.icon = icon;
    this.location = location;
    this.screen = screen;
  }
}

export const items = [
    new NavBarItem(ConnectionSVG, "Connection", Connection),
    new NavBarItem(LibrarySVG, "Library", LibraryMain),
    new NavBarItem(NowPlayingSVG, "NowPlaying", NowPlaying),
    new NavBarItem(PlaybackQueueSVG, "PlaybackQueue", PlaybackQueue),
];