export interface DataItem {
	id: string;
	title: string;
}

export type DataList = {
	id: string;
	name: string;
	items: Array<DataItem>;
}[]
