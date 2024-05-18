import {Button, Tag} from "antd";
import {useEffect, useState} from "react";
import {DndAnythingMultiple} from "react-dnd-anything";
import {PlusCircleOutlined} from "@ant-design/icons";

interface KanbanProps {
  data: {
    id: string;
    name: string;
    items: Array<{
      id: string;
      title: string;
    }>;
  }[];
}

export default (props: KanbanProps) => {
  const [dataGroup, setDataGroup] = useState<any[]>([]);

  useEffect(() => {
    setDataGroup(
      props.data?.map((item) => {
        return {
          id: item.id,
          list: item.items.map((child) => {
            return {
              id: child.id,
              title: child.title,
            };
          }),
        };
      })
    );
  }, [props.data]);

  return (
    <DndAnythingMultiple
      style={{
        // border: "1px solid black",
        boxSizing: "border-box",
        marginBottom: "20px",
        padding: "20px",
      }}
      wrapperClassName="flex items-start h-full"
      containerClassName="w-72 mr-4 bg-[#F4F5F7] rounded-xl h-full overflow-auto border-box"
      renderChildren={(item, {isDragging, isDraggingOver}) => {
        return (
          <div
            onClick={() => {
              console.log("item", item);
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
  );
};
