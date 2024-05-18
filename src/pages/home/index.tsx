import { Kanban } from "../../components";
import { Tabs } from "antd";
import { useState } from "react";

export default function() {

	const [currentTab, setCurrentTab] = useState('1');

	return (
    <div className="px-4">
      <Tabs centered
				activeKey={currentTab}
				onChange={(key) => setCurrentTab(key)}
			>
        <Tabs.TabPane tab="看板" key="1"></Tabs.TabPane>
        <Tabs.TabPane tab="列表" key="2"></Tabs.TabPane>
      </Tabs>
			<Kanban />
    </div>
  );
}
