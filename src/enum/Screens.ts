export enum Screen {
	Connection,
	Library,
	NowPlaying,
	PlaybackQueue,
}

export const screens = Object.keys(Screen).filter((k) =>
	isNaN(Number(k)),
) as (keyof typeof Screen)[];
