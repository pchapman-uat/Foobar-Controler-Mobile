import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { TouchableOpacity, View, Text } from "react-native";
import { State, Status } from "../classes/BeefWeb";
import { WebRequest } from "../classes/WebRequest";
import { PlayerResponse } from "../classes/responses/Player";
import { MenuSVG } from "../managers/SVGManager";
import { RootStackParamList } from "App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useStyles } from "managers/StyleManager";
import { getColor } from "managers/ThemeManager";
import { Screen } from "enum/Screens";
type StatusBarProps = {
	navigator: NativeStackNavigationProp<RootStackParamList, "Home">;
	onNavigate: (screen: number) => void;
};

const StatusBar: React.FC<StatusBarProps> = ({ navigator, onNavigate }) => {
	const ctx = useContext(AppContext);
	const Style = useStyles("StatusBar");
	const [status, setStatus] = useState<Status>(Status.Offline);
	const [state, setState] = useState<State>(State.Disconnected);
	const [title, setTitle] = useState("");
	const [album, setAlbum] = useState("");
	const onUpdate = (request: WebRequest<PlayerResponse> | undefined) => {
		if (!request) return;
		console.log("Updating Status");
		setStatus(ctx.BeefWeb.status);
		const columns = request.data.activeItem.columns;
		if (!columns) return;
		setTitle(columns.title);
		setAlbum(columns.album);
		setState(ctx.BeefWeb.state);
		console.log(getStateColor(state));
	};

	const getStatusColor = (status: Status) => {
		switch (status) {
			case Status.Online:
				return "green";
			case Status.Error:
				return "red";
			case Status.Offline:
				return "yellow";
		}
	};

	const getStateColor = (state: State) => {
		console.log(state);
		switch (state) {
			case State.Disconnected:
				return "red";
			case State.Stopped:
				return "yellow";
			case State.Running:
				return "green";
		}
	};

	const forceUpdate = async () => {
		onUpdate(await ctx.BeefWeb.getPlayer());
	};

	useEffect(() => {
		ctx.BeefWeb.addEventListener("update", async (e) => onUpdate(await e));
		forceUpdate();
	}, []);

	return (
		<View style={Style.StatusBar.StatusBarContainer}>
			<TouchableOpacity onPress={forceUpdate}>
				<View
					style={{
						...Style.StatusBar.StatusCircle,
						backgroundColor: getStatusColor(status),
						borderColor: getStateColor(state),
						borderWidth: 1,
					}}
				></View>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => onNavigate(Screen.NowPlaying)}
				style={Style.StatusBar.StatusTextContainer}
			>
				<Text style={Style.StatusBar.StatusText}>
					{title} - {album}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity>
				<MenuSVG
					height={40}
					width={40}
					color={getColor(ctx.theme, "textPrimary")}
					onPress={() => navigator.navigate("Settings")}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default StatusBar;
