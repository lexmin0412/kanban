interface ListProps {
  data: any[];
}

export default function List(props: ListProps) {

	console.log(props.data, 111);

  return (
    <div className="w-full px-20">
      <div className="mb-2 text-base flex items-center font-semibold border-b border-b-slate-700 border-solid border-x-0 border-t-0 pb-2">
        <div className="w-96 ellipsis-single ">标题</div>
        <div className="ml-3">预计结束时间</div>
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
                  <div className="ml-3">{child.expected_end_at}</div>
                </div>
              );
            })
          : null;
      })}
    </div>
  );
}
