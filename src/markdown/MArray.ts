export class MArray<T> extends Array<T> {
	public get last(): T {
		return this.length > 0 ? this[this.length - 1] : undefined;
	}
}