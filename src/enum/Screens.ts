export enum Screen {
	Connection,
	NowPlaying,
	Library,
	PlaybackQueue,
}

export const screens = Object.keys(Screen).filter((k) =>
	isNaN(Number(k)),
) as (keyof typeof Screen)[];
