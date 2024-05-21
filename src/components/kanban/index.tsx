import {useOssClient} from "@/hooks";
import {DataItem, DataList} from "@/types";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {Tag, Modal, Form, Input, DatePicker} from "antd";
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {DndAnythingMultiple} from 'react-dnd-anything';

interface KanbanProps {
  data: DataList;
  onRefresh: () => void;
}

export default (props: KanbanProps) => {
  const {onRefresh} = props;

  const [dataGroup, setDataGroup] = useState<any[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DataItem>();
  const [detailMode, setDetailMode] = useState<"view" | "edit">("view");
  const [form] = Form.useForm();
  const {ossClient} = useOssClient(() => {});

  useEffect(() => {
    setDataGroup(
      props.data?.map((item) => {
        return {
          id: item.id,
					title: item.title,
          list: item.items,
        };
      })
    );
  }, [props.data]);

  console.log("form11", form.getFieldsValue());

  const handleCloseModal = () => {
    setCurrentItem(undefined);
    setDetailModalOpen(false);
    setDetailMode("view");
  };

  return (
    <>
      <DndAnythingMultiple
        style={{
          // border: "1px solid black",
          boxSizing: "border-box",
          marginBottom: "20px",
          padding: "20px",
        }}
        wrapperClassName="flex items-start h-full"
        containerClassName="w-72 mr-4 bg-[#F4F5F7] rounded-xl h-full overflow-auto border-box"
        renderGroup={(groupContent, options) => {
          return (
            <div>
              {options.group.title ? (
                <div className=" h-6 leading-6 text-lg border-l-4 border-blue-600 border-solid border-y-0 border-r-0 mb-2 pl-2">
                  {options.group.title}
                </div>
              ) : null}
              {groupContent}
            </div>
          );
        }}
        renderChildren={(item) => {
          return (
            <div
              onClick={() => {
                console.log("item", item);
                setDetailModalOpen(true);
                setCurrentItem(item);
                form.setFieldsValue({
                  title: item.title,
                  description: item.description,
                  expected_end_at: item.expected_end_at
                    ? dayjs(item.expected_end_at)
                    : undefined,
                  // expected_end_at: item.expected_end_at ? dayjs(item.expected_end_at) : undefined,
                });
              }}
              className="rounded w- shadow-slate-400 bg-white mb-2 p-2 text-sm"
            >
              <div className="two-line-ellipsis font-semibold h-10">
                {item.title}
              </div>
              <div className="h-7 leading-7 flex items-center">
                {item.repoName ? (
                  <Tag className="mt-2">{item.repoName}</Tag>
                ) : null}
              </div>
            </div>
          );
        }}
        direction="vertical"
        dataGroup={dataGroup}
        onDataGroupChange={(dataGroup) => setDataGroup(dataGroup)}
      />

      <Modal
        title={
          <div className="flex items-center">
            <span>详情</span>
            {detailMode === "view" && (
              <EditOutlined
                className="ml-2 cursor-pointer"
                onClick={() => setDetailMode("edit")}
              />
            )}
            <DeleteOutlined
              className="ml-2 cursor-pointer"
              onClick={async () => {
                Modal.confirm({
                  title: "确定删除吗？",
                  content: "删除后不可恢复",
                  onOk: async () => {
                    await ossClient?.deleteItem(currentItem?.id as string);
                    handleCloseModal();
                    onRefresh?.();
                  },
                });
              }}
            />
          </div>
        }
        closable={false}
        cancelText={detailMode === "view" ? "关闭" : "取消"}
        okButtonProps={
          detailMode === "view"
            ? {
                children: null,
                style: {
                  display: "none",
                },
              }
            : {
                children: "确定",
              }
        }
        onCancel={() => {
          setCurrentItem(undefined);
          setDetailModalOpen(false);
          setDetailMode("view");
        }}
        onOk={async () => {
          if (detailMode === "view") {
            return Promise.resolve();
          }
          await form.validateFields();
          await ossClient?.updateItem({
            id: currentItem?.id,
            ...form.getFieldsValue(),
            expected_end_at: dayjs(
              form.getFieldsValue().expected_end_at
            ).format("YYYY-MM-DD"),
          });
          console.log("成功了");
          handleCloseModal();
          onRefresh?.();
        }}
        open={detailModalOpen}
      >
        <div className="mt-4">
          {detailMode === "view" ? (
            <div>
              <div className="flex-1">标题：{currentItem?.title}</div>
              <div className="flex-1">描述：{currentItem?.description}</div>
              <div className="flex-1">
                预计实现时间：{currentItem?.expected_end_at}
              </div>
            </div>
          ) : (
            <Form form={form}>
              <Form.Item
                name="title"
                label="标题"
                rules={[
                  {
                    required: true,
                    message: "标题不能为空",
                  },
                ]}
              >
                <Input type="text" placeholder="请输入标题" />
              </Form.Item>

              <Form.Item
                name="description"
                label="描述"
                rules={[
                  {
                    required: true,
                    message: "描述不能为空",
                  },
                ]}
              >
                <Input.TextArea placeholder="请输入描述" />
              </Form.Item>

              <Form.Item name="expected_end_at" label="预计结束时间">
                <DatePicker placeholder="请选择预计结束时间" />
              </Form.Item>
            </Form>
          )}
        </div>
      </Modal>
    </>
  );
};
