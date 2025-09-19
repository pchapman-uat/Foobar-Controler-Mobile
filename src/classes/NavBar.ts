import { SvgProps } from "react-native-svg";
import {
	ConnectionSVG,
	LibrarySVG,
	NowPlayingSVG,
	PlaybackQueueSVG,
} from "../managers/SVGManager";
import Connection from "screens/home/Connection";
import LibraryMain, { LibraryItems } from "screens/home/LibraryMain";
import NowPlaying from "screens/home/NowPlaying";
import PlaybackQueue from "screens/home/PlaybackQueue";
import { NavigateToType } from "elements/NavBarScreen";

type Icon = React.FC<SvgProps>;

export type NavBarItemProps<Page extends ItemsType> = {
	navigateTo: NavigateToType;
	props?: PagePropsMap[Page];
};

export type PagePropsMap = {
	Connection: undefined;
	Library: LibraryMainProps;
	NowPlaying: undefined;
	PlaybackQueue: undefined;
};
export type ItemsType = keyof PagePropsMap;
export type LibraryMainProps = {
	page?: LibraryItems;
	value?: string;
};

class NavBarItem<T extends ItemsType> {
	icon: Icon;
	location: string;
	screen: (props: NavBarItemProps<T>) => React.JSX.Element;

	constructor(
		icon: Icon,
		location: string,
		screen: (props: NavBarItemProps<T>) => React.JSX.Element,
	) {
		this.icon = icon;
		this.location = location;
		this.screen = screen;
	}
}

export const itemsObj = {
	Connection: new NavBarItem(ConnectionSVG, "Connection", Connection),
	Library: new NavBarItem(LibrarySVG, "Library", LibraryMain),
	NowPlaying: new NavBarItem(NowPlayingSVG, "NowPlaying", NowPlaying),
	PlaybackQueue: new NavBarItem(
		PlaybackQueueSVG,
		"PlaybackQueue",
		PlaybackQueue,
	),
} as const;

export const items = Object.values(itemsObj);
