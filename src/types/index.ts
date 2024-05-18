export interface DataItem {
	id: string;
	title: string;
	expected_end_at: string;
}

export type DataList = {
	id: string;
	name: string;
	items: Array<DataItem>;
}[]
