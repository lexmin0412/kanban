import {useOssClient} from "@/hooks";
import {DatePicker, Form, Input, Modal, ModalProps, Select} from "antd";
import { DefaultOptionType } from "antd/es/select";
import dayjs from "dayjs";
import {useEffect, useState} from "react";

interface ICreateModalProps extends ModalProps {}

export const CreateModal = (props: ICreateModalProps) => {
  const {onOk} = props;
  const [form] = Form.useForm();
  const {ossClient} = useOssClient(() => {});
  const [groupOptions, setGroupOptions] = useState<DefaultOptionType[]>([]);

  const init = async () => {
    const res = await ossClient?.listGroup();
    setGroupOptions(res);
  };

  useEffect(() => {
    init();
  }, [ossClient]);

  const handleOk = async (e) => {
    console.log("handleOk", form.getFieldsValue());

    const {title, description, expected_end_at, groupID} =
      form.getFieldsValue();

    if (type === "group") {
      await ossClient?.addGroup({
        id: `PFC-${Date.now()}`,
        title,
      });
    } else {
      await ossClient?.addItem(
        {
          id: `PFC-${Date.now()}`,
          title,
          description,
          expected_end_at: dayjs(expected_end_at).format("YYYY-MM-DD"),
        },
        groupID
      );
    }

    form.resetFields();
    onOk?.(e);
  };

  const type = Form.useWatch("type", form);

  return (
    <Modal title="创建" {...props} onOk={handleOk}>
      <Form form={form} className="mt-4">
        <Form.Item name="type" label="类型">
          <Select
            placeholder="请选择类型"
            options={[
              {
                label: "分组",
                value: "group",
              },
              {
                label: "事项",
                value: "item",
              },
            ]}
          />
        </Form.Item>

        {type === "item" && (
          <Form.Item name="groupID" label="所属分组">
            <Select placeholder="请选择所属分组" options={groupOptions} />
          </Form.Item>
        )}

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

        <Form.Item name="description" label="描述">
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>

        {type === "item" && (
          <Form.Item name="expected_end_at" label="预计结束时间">
            <DatePicker placeholder="请选择预计结束时间" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
