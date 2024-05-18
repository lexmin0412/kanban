import { OssClientInitProps } from "@/utils/oss";
import {Modal, Form, Input, Selector} from "antd-mobile";
import {useEffect, useState} from "react";
import OssClient from "@/utils/oss";

const regions = [
  {
    label: "杭州",
    value: "oss-cn-hangzhou",
  },
  {
    label: "上海",
    value: "oss-cn-shanghai",
  },
  {
    label: "深圳",
    value: "oss-cn-shenzhen",
  },
  {
    label: "北京",
    value: "oss-cn-beijing",
  },
];

export const useOssClient = (onOk: (values: OssClientInitProps) => void) => {
  const [ossClient, setOssClient] = useState<OssClient>();
  const [ossInitModalOpen, setOssInitModalOpen] = useState(false);
  const [form] = Form.useForm();

  /**
   * 初始化 OSS 实例
   */
  const initOSSClient = (config: OssClientInitProps) => {
    const newOssClient = new OssClient(config);
    setOssClient(newOssClient);
    localStorage.setItem("oss-config", JSON.stringify(config));
  };

  const handleOk = async () => {
    await form.validateFields();
    console.log("form.getFieldsValue())", form.getFieldsValue());
    await onOk({
      ...form.getFieldsValue(),
      region: form.getFieldValue("region")[0],
    });
    Modal.clear();
  };

  useEffect(() => {
    const storageConfigs = localStorage.getItem("oss-config");
    if (!storageConfigs) {
      Modal.show({
        title: "初始化配置",
        content: (
          <Form form={form}>
            <Form.Item
              name="region"
              label="地域"
              required
              rules={[
                {
                  required: true,
                  message: "地域不能为空",
                },
              ]}
            >
              <Selector options={regions} />
            </Form.Item>
            <Form.Item
              name="bucket"
              label="Bucket"
              required
              rules={[
                {
                  required: true,
                  message: "Bucket 不能为空",
                },
              ]}
            >
              <Input type="text" placeholder="请输入 Bucket 名" />
            </Form.Item>
            <Form.Item
              name="accessKeyId"
              label="AccesssKeyId"
              required
              rules={[
                {
                  required: true,
                  message: "AccesssKeyId 不能为空",
                },
              ]}
            >
              <Input type="text" placeholder="请输入 AccesssKeyId" />
            </Form.Item>
            <Form.Item
              name="accessKeySecret"
              label="AccessKeySecret"
              required
              rules={[
                {
                  required: true,
                  message: "AccessKeySecret 不能为空",
                },
              ]}
            >
              <Input type="text" placeholder="请输入 AccessKeySecret" />
            </Form.Item>
          </Form>
        ),
        actions: [
          {
            key: "confirm",
            text: "确定",
            primary: true,
          },
        ],
        onAction: (e) => {
          console.log("eee", e);
          if (e.key === "confirm") {
            handleOk();
          }
        },
      });
    } else {
      const parsedConfig = JSON.parse(storageConfigs);
      initOSSClient(parsedConfig);
    }
  }, []);

  return {
    ossClient,
    ossInitModalOpen,
    initOSSClient,
    setOssInitModalOpen,
  };
};
