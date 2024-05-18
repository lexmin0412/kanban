import { Kanban } from "../../components";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { OssClientInitProps } from "@/utils/oss";
import { useOssClient } from "@/hooks";
import { DataList } from "@/types";
import { useRequest } from "ahooks";
import OSS from "ali-oss";
import List from "@/components/list";

export default function() {

	const [currentTab, setCurrentTab] = useState('1');

	const handleOssInitModalConfirm = (values: OssClientInitProps) => {
    initOSSClient(values);
    setOssInitModalOpen(false);
  };

  const {ossClient, initOSSClient, setOssInitModalOpen} = useOssClient(
    handleOssInitModalConfirm
  );
  const [data, setData] = useState<DataList>([]);

	const {runAsync: fetchList} = useRequest(
    () => {
      return ossClient?.getList() as Promise<OSS.GetObjectResult>;
    },
    {
      manual: true,
      onSuccess: (res) => {
        const data = (
          JSON.parse(res.content.toString()).data as DataList
        )
        setData(data);
      },
    }
  );

	console.log('data', data)

	useEffect(() => {
    if (ossClient) {
      fetchList();
    }
  }, [ossClient]);

	return (
    <div className="px-4 flex flex-col h-screen">
      <Tabs centered
				activeKey={currentTab}
				onChange={(key) => setCurrentTab(key)}
			>
        <Tabs.TabPane tab="看板" key="1"></Tabs.TabPane>
        <Tabs.TabPane tab="列表" key="2"></Tabs.TabPane>
      </Tabs>
			<div className="flex-1 flex overflow-hidden pb-5">
				{
					currentTab === '1' ?
					<Kanban data={data} />
					:
					<List data={data} />
				}
			</div>
    </div>
  );
}
