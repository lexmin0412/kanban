import { DataItem, DataList, GroupItem } from "@/types";
import OSS from "ali-oss";
import { DefaultOptionType } from "antd/es/select";

export interface OssClientInitProps {
	region: string;
	accessKeyId: string;
	accessKeySecret: string;
	bucket: string;
}

class OssClient {
	constructor(props: OssClientInitProps) {
		const store = new OSS({
			region: props.region,
			accessKeyId: props.accessKeyId,
			accessKeySecret: props.accessKeySecret,
			bucket: props.bucket,
		});
		this.store = store;
	}

	store: OSS;

	getList() {
		return this.store.get('apis/kanban/data.json', undefined, {
			headers: {
				'Content-type': 'application/json'
			}
		})
	}

	/**
	 * 列出分组
	 */
	listGroup(): Promise<DefaultOptionType[]> {
		return this.getList().then(res => {
			const data: DataList = JSON.parse(res.content.toString()).data;
			console.log('shit111', data)
			return data.map((item) => {
				return {
					value: item.id,
					label: item.title
				}
			});
		})
	}

	async addGroup(newItem: GroupItem) {
		const res = await this.getList()
		const data = JSON.parse(res.content.toString()).data
		const newData = [...data, newItem]
		console.log('newData', newData)
		// @ts-ignore
		return this.store.put(`/apis/kanban/data.json`, new OSS.Buffer(JSON.stringify({
			data: newData
		}, null, 2)))
	}

	async updateGroup(newItem: GroupItem) {
		const res = await this.getList()
		const data: DataList = JSON.parse(res.content.toString()).data
		const newData = data.map((item)=>{
			if (item.id === newItem.id) {
				return {
					...item,
					...newItem,
				}
			}
			return item
		})
		// @ts-ignore
		return this.store.put(`/apis/kanban/data.json`, new OSS.Buffer(JSON.stringify({
			data: newData
		}, null, 2)))
	}

	async addItem(newItem: DataItem, groupID?: string) {
		const res = await this.getList()
		const data: DataList = JSON.parse(res.content.toString()).data
		const newData = data.map((item)=>{
			if (item.id === groupID) {
				return {
					...item,
					items: [
						...(item.items || []),
						newItem
					]
				}
			}
			return item
		})
		console.log('newData', newData)
		// @ts-ignore
		return this.store.put(`/apis/kanban/data.json`, new OSS.Buffer(JSON.stringify({
			data: newData
		}, null, 2)))
	}

	async updateItem(newItem: DataItem) {
		const res = await this.getList()
		const data: DataList = JSON.parse(res.content.toString()).data
		const newData = data.map((item) => {
			return {
				...item,
				items: item.items?.map((child)=>{
					if (child.id === newItem.id) {
						return {
							...child,
							...newItem
						}
					} else {
						return child
					}
				})
			}
		})
		console.log('newData', newData)
		// @ts-ignore
		return this.store.put(`/apis/kanban/data.json`, new OSS.Buffer(JSON.stringify({
			data: newData
		}, null, 2)))
	}

	async deleteItem(id: string) {
		const res = await this.getList()
		const data: DataList = JSON.parse(res.content.toString()).data
		const newData = data.map((item) => {
			return {
				...item,
				items: item.items?.filter((child) => {
					return child.id !== id
				})
			}
		})
		console.log('newData', newData)
		// @ts-ignore
		return this.store.put(`/apis/kanban/data.json`, new OSS.Buffer(JSON.stringify({
			data: newData
		}, null, 2)))
	}
}

export default OssClient;
