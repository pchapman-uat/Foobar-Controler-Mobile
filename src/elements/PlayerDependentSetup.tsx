import { PlayerType } from "App";
import { StyleMapType } from "managers/StyleManager";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-elements";

function oppositePlayer(player: PlayerType): PlayerType {
	return player === "Foobar2000" ? "DeaDBeeF" : "Foobar2000";
}

type PlayerDependentSetupProps = {
	player: PlayerType;
	Styles: Pick<StyleMapType, "Main" | "Setup">;
	children?: [React.ReactElement, React.ReactElement];
};

export default function PlayerDependentSetup({
	player,
	Styles,
	children,
}: PlayerDependentSetupProps) {
	const [_player, setPlayer] = useState(player);
	if (!children || children.length !== 2)
		throw new Error(
			"PlayerDependentSetup requires exactly two children. This error should not occur",
		);
	const [Foobar, DeadBeef] = children;
	const PlayerSetup = ({ player }: { player: PlayerType }) => {
		if (player === "Foobar2000") return <>{Foobar}</>;
		else return <>{DeadBeef}</>;
	};
	const SwitchButton = ({ player }: { player: PlayerType }) => {
		return (
			<Button
				style={Styles.Main.button}
				title={"Switch to " + oppositePlayer(player)}
				onPress={() => setPlayer(oppositePlayer(player))}
			/>
		);
	};
	return (
		<View style={Styles.Setup.container}>
			<SwitchButton player={_player} />
			<PlayerSetup player={_player} />
		</View>
	);
}
