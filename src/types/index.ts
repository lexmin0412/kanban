export interface DataItem {
	id: string;
	title: string;
	description: string
	expected_end_at: string;
}

export type GroupItem = {
	id: string;
	title: string;
	items?: Array<DataItem>;
}

export type DataList = GroupItem[]
