export class ExecutionComponent extends HTMLElement {
	private readonly playButton: HTMLElement;
	private readonly playInner: HTMLElement;
	private readonly playingInner: HTMLElement;

	private isPlaying: boolean;

	public get value(): string {
		return this.getAttribute("value");
	}
	public set value(value: string) {
		this.setAttribute("value", value);
	}

	public constructor() {
		//#region Local functions
		const createCommandBar: () => HTMLElement = () => {
			const commandBar = document.createElement("div");
			Object.assign(commandBar.style, {
				width: "calc(100% - 17px)",
				padding: "4px 10px 2px 10px",
				boxSizing: "border-box",
				backgroundColor: "#252526"
			} as CSSStyleDeclaration);
			commandBar.classList.add("monaco-editor");
			return commandBar;
		};
		const createPlay: () => HTMLElement = () => {
			const playButton = document.createElement("button");
			Object.assign(playButton.style, {
				border: "none",
				outline: "none",
				background: "none",
				fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
				fontSize: "16px"
			} as CSSStyleDeclaration);
			playButton.classList.add("mtk1");
			return playButton;
		};
		const createPlayInner: () => HTMLElement = () => {
			const main = document.createElement("div");
			Object.assign(main.style, {
				cursor: "pointer"
			} as CSSStyleDeclaration);

			const playIcon = document.createElement("i");
			Object.assign(playIcon.style, {
				marginRight: "6px"
			} as CSSStyleDeclaration);
			playIcon.classList.add("codicon", "codicon-debug-start");
			main.appendChild(playIcon);

			main.appendChild(document.createTextNode("Run"));

			return main;
		};
		const createPlayingInner: () => HTMLElement = () => {
			const main = document.createElement("div");

			const playIcon = document.createElement("i");
			Object.assign(playIcon.style, {
				marginRight: "6px"
			} as CSSStyleDeclaration);
			playIcon.classList.add("codicon", "codicon-loading", "codicon-animation-spin");
			main.appendChild(playIcon);

			main.appendChild(document.createTextNode("Running..."));

			return main;
		};
		//#endregion Local functions

		super();

		const commandBar = createCommandBar();
		this.appendChild(commandBar);

		this.playButton = createPlay();
		commandBar.appendChild(this.playButton);
		this.playInner = createPlayInner();
		this.playingInner = createPlayingInner();
		this.playButton.appendChild(this.playInner);
		this.playButton.addEventListener("click", this.onPlayClick.bind(this), false);
	}

	private onPlayClick(): void {
		if (!this.isPlaying) {
			this.executeCode();
		}
	}

	private setPlayingState(isPlaying: boolean): void {
		this.isPlaying = isPlaying;

		this.playButton.replaceChild(
			this.isPlaying ? this.playingInner : this.playInner,
			this.playButton.firstChild
		);
	}

	public async executeCode(): Promise<void> {
		this.setPlayingState(true);
		// await ...
		this.setPlayingState(false);
	}
}