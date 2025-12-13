import { useLogger } from "helpers/index";

export default class GitHub {
	private static readonly LOGGER = useLogger("GitHub");

	private static readonly BASE_URL: string = "https://api.github.com";

	public static async getRepoReleaseVersion(
		owner: string,
		repo: string,
	): Promise<string | null> {
		const response = await fetch(
			this.BASE_URL + `/repos/${owner}/${repo}/releases`,
		);
		if (!response.ok) {
			this.LOGGER.error(
				`Failed to fetch releases for ${owner}/${repo}: ${response.status} ${response.statusText}`,
			);
			return null;
		} else {
			const releases = await response.json();
			releases.sort((a: any, b: any) => {
				const dateA = new Date(a.published_at).getTime();
				const dateB = new Date(b.published_at).getTime();
				return dateB - dateA;
			});
			return releases[0].tag_name;
		}
	}
}
