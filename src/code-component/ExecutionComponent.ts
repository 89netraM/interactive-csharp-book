import { BrowserCSharp } from "browser-csharp";

export class ExecutionComponent extends HTMLElement {
	private static readonly infoText = "This code example is interactive";

	private readonly commandBar: HTMLElement;
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
				backgroundColor: "#252526",
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between"
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
		const createInfo: (infoText: string) => HTMLElement = (infoText) => {
			const main = document.createElement("div");
			Object.assign(main.style, {
				fontSize: "0.9em"
			} as CSSStyleDeclaration);

			main.appendChild(document.createTextNode(infoText));

			const icon = document.createElement("i");
			Object.assign(icon.style, {
				marginLeft: "6px",
				verticalAlign: "middle"
			} as CSSStyleDeclaration);
			icon.classList.add("codicon", "codicon-info");
			main.appendChild(icon);

			return main;
		};
		//#endregion Local functions

		super();

		this.commandBar = createCommandBar();
		this.appendChild(this.commandBar);

		this.playButton = createPlay();
		this.commandBar.appendChild(this.playButton);
		this.playInner = createPlayInner();
		this.playingInner = createPlayingInner();
		this.playButton.appendChild(this.playInner);
		this.playButton.addEventListener("click", this.play.bind(this), false);

		const info = createInfo(ExecutionComponent.infoText);
		this.commandBar.appendChild(info);
	}

	public play(): void {
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

	private showError(message: string): void {
		const createError: (message: string) => HTMLElement = (message) => {
			const main = document.createElement("div");
			Object.assign(main.style, {
				position: "relative",
				fontSize: "16px",
				padding: "1px 6px"
			} as CSSStyleDeclaration);
			main.classList.add("zone-widget");

			const errorIcon = document.createElement("i");
			Object.assign(errorIcon.style, {
				marginRight: "6px"
			} as CSSStyleDeclaration);
			errorIcon.classList.add("codicon", "codicon-error", "codicon-error");
			main.appendChild(errorIcon);

			main.appendChild(document.createTextNode(message));

			return main;
		};

		this.commandBar.replaceChild(
			createError(message),
			this.playButton
		);
	}

	private waitForCSharp(): Promise<boolean> {
		return new Promise(r => BrowserCSharp.OnReady(r));
	}

	private async executeCode(): Promise<void> {
		this.setPlayingState(true);

		const codeToExecute = this.value;

		const success = await this.waitForCSharp();
		if (success) {
			const response = await BrowserCSharp.ExecuteScript(codeToExecute)
			if (response.stdErr != null) {
				console.warn(response.stdErr);
			}
			else {
				console.log(response.stdOut, response.result);
			}

			this.setPlayingState(false);
		}
		else {
			this.showError("Couldn't load the C# runtime");
		}
	}
}