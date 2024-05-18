import { DataItem } from "@/types";
import OSS from "ali-oss";

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

	async add(newItem: {
		id: string
		title: string
		date: string
		tags: string[]
	}) {
		const res = await this.getList()
		const events = JSON.parse(res.content.toString()).events
		const newEvents = [
			...events,
			newItem
		]
		console.log('hahaha', newEvents)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return this.store.put(`/apis/kanban/data.json`, new OSS.Buffer(JSON.stringify({
			events: newEvents
		}, null, 2)))
	}

	async update(id: string, newValues: Omit<DataItem, 'id'>) {
		const res = await this.getList()
		const events = JSON.parse(res.content.toString()).events
		const newEvents = events.map((item: DataItem) => {
			if (item.id === id) {
				return {
					...item,
					...newValues
				}
			}
			return item
		})
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return this.store.put(`/apis/kanban/data.json`, new OSS.Buffer(JSON.stringify({
			events: newEvents
		}, null, 2)))
	}

	async delete(id: string) {
		const res = await this.getList()
		const events = JSON.parse(res.content.toString()).events

		const newEvents = events.filter((item: DataItem) => item.id !== id)
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return this.store.put(`/apis/kanban/data.json`, new OSS.Buffer(JSON.stringify({
			events: newEvents
		}, null, 2)))
	}

	/**
	 * 查询详情
	 * @param id 故事id
	 */
	async getDetail(id: string) {
		const res = await this.getList()
		const events = JSON.parse(res.content.toString()).events

		const detail = events.find((item: DataItem) => item.id === id)
		return detail
	}
}

export default OssClient;
