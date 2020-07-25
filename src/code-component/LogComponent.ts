export class LogComponent extends HTMLElement {
	private static readonly sizeAndLineHeightDifference = 5;
	private static readonly maxLines = 5;
	private static readonly observedAttributes = [
		"value",
		"size",
		"visible"
	] as const;

	private readonly container: HTMLOListElement;

	public get value(): string {
		return this.getAttribute("value");
	}
	public set value(value: string) {
		if (this.value !== value) {
			this.setAttribute("value", value);
			this.updateValue();
		}
	}
	private updateValue(): void {
		while (this.container.hasChildNodes()) {
			this.container.removeChild(this.container.firstChild);
		}

		for (const line of this.value.split("\n")) {
			this.container.appendChild(this.createLogLine(line));
		}
	}

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
		Object.assign(this.container.style, {
			maxHeight: `${this.maxHeight}px`,
			fontSize: `${this.size}px`,
			lineHeight: `${this.size + LogComponent.sizeAndLineHeightDifference}px`
		} as CSSStyleDeclaration);
	}

	private get maxHeight(): number {
		return (this.size + LogComponent.sizeAndLineHeightDifference) * LogComponent.maxLines;
	}

	public get visible(): boolean {
		return this.hasAttribute("visible");
	}
	public set visible(value: boolean) {
		if (this.visible !== value) {
			this.toggleAttribute("visible", value);
			this.updateVisible();
		}
	}
	private updateVisible(): void {
		Object.assign(this.container.style, {
			display: this.visible ? "block" : "none"
		} as CSSStyleDeclaration);
	}

	public constructor() {
		//#region Local functions
		const createStyles: () => HTMLStyleElement = () => {
			const styles = document.createElement("style");
			styles.innerHTML = `
				* {
					box-sizing: border-box;
				}
				ol {
					width: 100%;
					position: relative;
					overflow-y: auto;
					padding: 10px calc(2ch + 20px);
					margin: 0px;
					list-style: none;
					font-family: Consolas, "Courier New", monospace;
					background-color: #1e1e1e;
					color: #d4d4d4;
				}
				li {
					position: relative;
				}
				li[data-before="×"] {
					color: #f48771;
				}
				li::before {
					content: attr(data-before);
					position: absolute;
					left: -2ch;
				}
			`;

			return styles;
		};
		const createContainer: () => HTMLOListElement = () => {
			const container = document.createElement("ol");
			Object.assign(container.style, {
				maxHeight: `${this.maxHeight}px`,
				fontSize: `${this.size}px`,
				lineHeight: `${this.size + LogComponent.sizeAndLineHeightDifference}px`,
				display: "none"
			} as CSSStyleDeclaration);

			return container;
		};
		//#endregion Local functions

		super();

		this.attachShadow({ mode: "open" });

		this.shadowRoot.appendChild(createStyles());

		this.container = createContainer();
		this.shadowRoot.appendChild(this.container);
	}

	private createLogLine(value: string): HTMLLIElement {
		value = value.trim();
		const matches = /(?:^(.) )?(.*)/.exec(value);

		const li = document.createElement("li");
		li.innerText = matches[2];

		if (matches[1] != null && matches[1].length > 0) {
			li.setAttribute("data-before", matches[1]);
		}

		return li;
	}

	public attributeChangedCallback(name: (typeof LogComponent.observedAttributes)[number], oldValue: string, newValue: string): void {
		if (oldValue != null && oldValue !== newValue) {
			switch (name) {
				case "value":
					this.updateValue();
					break;
				case "size":
					this.updateSize();
					break;
				case "visible":
					this.updateVisible();
					break;
			}
		}
	}
}