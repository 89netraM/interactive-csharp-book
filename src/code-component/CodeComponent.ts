import { editor, KeyMod, KeyCode } from "monaco-editor";
import { ExecutionComponent } from "./ExecutionComponent";

export class CodeComponent extends HTMLElement {
	private static readonly sizeAndLineHeightDifference = 5;
	private static readonly observedAttributes = [
		"language",
		"size"
	] as const;

	private readonly model: editor.ITextModel;
	private readonly editor: editor.IStandaloneCodeEditor;
	private readonly executioner: ExecutionComponent;

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
		const createContainer: () => HTMLElement = () => {
			const container = document.createElement("div");
			container.style.width = "100%";
			container.style.height = "9999px";
			container.style.position = "relative";

			return container;
		};
		const createExecutioner: () => ExecutionComponent = () => {
			return document.createElement("execution-component") as ExecutionComponent;
		};
		const extractText: () => string = () => {
			if (this.childNodes.length > 0) {
				const text = this.childNodes[0].nodeValue.trim();
				this.removeChild(this.childNodes[0]);
				return text;
			}
			else {
				return "";
			}
		};
		const createEditor: (model: editor.ITextModel, size: number, container: HTMLElement) => editor.IStandaloneCodeEditor = (model, size, container) => {
			const e = editor.create(
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
			e.addAction({
				id: "execution-run",
				label: "Run",
				keybindings: [
					KeyCode.F5,
					KeyMod.CtrlCmd | KeyCode.KEY_R
				],
				run: () => this.executioner.play()
			});

			return e;
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

			this.editor.getModel().onDidChangeContent(this.updateExecutionerContent.bind(this));
		};
		//#endregion Local functions

		super();

		this.language = this.getAttribute("language");
		this.model = editor.createModel(extractText(), this.language);

		const container = createContainer();
		this.appendChild(container);
		this.executioner = createExecutioner();
		this.executioner.size = this.size;
		this.appendChild(this.executioner);

		this.editor = createEditor(this.model, this.size, container);
		container.style.height = `${this.editor.getContentHeight()}px`;
		this.editor.layout();
		this.updateExecutionerContent();

		bindEventListeners();
	}

	private onResize(): void {
		this.editor.layout();
	}

	private updateExecutionerContent(): void {
		this.executioner.value = this.editor.getModel().getValue();
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