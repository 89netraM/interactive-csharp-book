import { editor } from "monaco-editor";

export class CodeComponent extends HTMLElement {
	private static readonly sizeAndLineHeightDifference = 5;
	private static readonly observedAttributes = [
		"language",
		"size"
	] as const;

	private readonly shadow: ShadowRoot;
	private readonly model: editor.ITextModel;
	private readonly editor: editor.IStandaloneCodeEditor;

	public readonly language: string;

	public get size(): number {
		return parseInt(this.getAttribute("size")) || 14;
	}
	public set size(value: number) {
		if (this.size !== value) {
			this.setAttribute("size", value.toString());
			this.updateSize();
		}
	}
	private updateSize(): void {
		this.editor.updateOptions({
			lineHeight: this.size + CodeComponent.sizeAndLineHeightDifference,
			fontSize: this.size
		});
	}

	public constructor() {
		//#region Local functions
		const createShadow: () => ShadowRoot = () => {
			const shadow = this.attachShadow({ mode: "closed" });
			document.head.querySelectorAll("style").forEach(s => shadow.appendChild(s.cloneNode(true)));

			return shadow;
		};
		const createContainer: () => HTMLElement = () => {
			const container = document.createElement("div");
			container.style.width = "100%";
			container.style.height = "9999px";
			container.style.position = "relative";

			return container;
		};
		const getText: () => string = () => {
			if (this.childNodes.length > 0) {
				return this.childNodes[0].nodeValue.trim();
			}
			else {
				return "";
			}
		};
		const createEditor: (model: editor.ITextModel, size: number, container: HTMLElement) => editor.IStandaloneCodeEditor = (model, size, container) => {
			return editor.create(
				container,
				{
					model,

					lineHeight: size + CodeComponent.sizeAndLineHeightDifference,
					fontSize: size,
					theme: "vs-dark",
					minimap: {
						enabled: false
					},
					scrollbar: {
						alwaysConsumeMouseWheel: false
					},
					smoothScrolling: true,
					overviewRulerLanes: 0,
					scrollBeyondLastLine: false,
					wordWrap: "on",
					wrappingIndent: "indent",
					contextmenu: false,
					lineNumbersMinChars: 3,
					multiCursorModifier: "ctrlCmd"
				}
			);
		};
		const bindEventListeners: () => void = () => {
			const bindResizeListener: () => void = () => {
				let oldWidth = this.getBoundingClientRect().width;

				const resizeCallback: () => void = () => {
					const rect = this.getBoundingClientRect();
					if (oldWidth !== rect.width) {
						oldWidth = rect.width;
						this.onResize();
					}
				};
	
				window.addEventListener("resize", resizeCallback, false);
			};

			bindResizeListener();
		};
		//#endregion Local functions

		super();

		this.language = this.getAttribute("language");
		this.model = editor.createModel(getText(), this.language);

		this.shadow = createShadow();

		const container = createContainer();
		this.shadow.appendChild(container);

		this.editor = createEditor(this.model, this.size, container);
		container.style.height = `${this.editor.getContentHeight()}px`;
		this.editor.layout();

		bindEventListeners();
	}

	private onResize(): void {
		this.editor.layout();
	}

	public attributeChangedCallback(name: (typeof CodeComponent.observedAttributes)[number], oldValue: string, newValue: string): void {
		if (oldValue != null && oldValue !== newValue) {
			switch (name) {
				case "language":
					if (newValue !== this.language) {
						this.setAttribute("language", this.language);
					}
					break;
				case "size":
					this.updateSize();
					break;
			}
		}
	}
}