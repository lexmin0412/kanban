import {DataList} from "@/types";

interface ListProps {
  data: DataList;
}

export default function List(props: ListProps) {
  return (
    <div className="w-full px-20">
      <div className="mb-2 text-base flex items-center font-semibold border-b border-b-slate-700 border-solid border-x-0 border-t-0 pb-2">
        <div className="w-96 ellipsis-single ">标题</div>
        <div className="ml-3 w-24">预计结束时间</div>
        <div className="ml-3">所属分组</div>
      </div>

      {props.data.map((item) => {
        return item.items?.length
          ? item.items.map((child) => {
              return (
                <div
                  key={child.id}
                  className="mb-2 text-base flex items-center"
                >
                  <div className="w-96 ellipsis-single ">{child.title}</div>
                  <div className="ml-3 w-24">{child.expected_end_at}</div>
                  <div className="ml-3 ellipsis-single w-48">{item.title}</div>
                </div>
              );
            })
          : null;
      })}
    </div>
  );
}
