import {Kanban} from "../../components";
import {Tabs} from "antd";
import {useEffect, useState} from "react";
import {OssClientInitProps} from "@/utils/oss";
import {useOssClient} from "@/hooks";
import {DataList} from "@/types";
import {useRequest} from "ahooks";
import OSS from "ali-oss";
import List from "@/components/list";
import {PlusOutlined} from "@ant-design/icons";
import {CreateModal} from "@/components/modal/create";

export default function () {
  const [currentTab, setCurrentTab] = useState("1");
  const [createModalOpen, setCreateModalOpen] = useState(false);

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
        const data = JSON.parse(res.content.toString()).data as DataList;
        setData(data);
      },
    }
  );

  console.log("data", data);

  useEffect(() => {
    if (ossClient) {
      fetchList();
    }
  }, [ossClient]);

  return (
    <div className="px-4 flex flex-col h-screen">
      <div className="fixed right-3 font-bold h-[46px] flex items-center z-50">
        <PlusOutlined
          style={{
            width: "28px",
            height: "28px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => {
            setCreateModalOpen(true);
          }}
        />
      </div>

      <CreateModal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={() => {
          setCreateModalOpen(false);
          fetchList();
        }}
      />

      <Tabs
        centered
        activeKey={currentTab}
        onChange={(key) => setCurrentTab(key)}
      >
        <Tabs.TabPane tab="看板" key="1"></Tabs.TabPane>
        <Tabs.TabPane tab="列表" key="2"></Tabs.TabPane>
      </Tabs>
      <div className="flex-1 flex overflow-hidden pb-5">
        {currentTab === "1" ? (
          <Kanban data={data} onRefresh={fetchList} />
        ) : (
          <List data={data} />
        )}
      </div>
    </div>
  );
}
