import {RouterProvider} from "react-router-dom";
import {ConfigProvider} from "antd";
import zhCN from "antd/locale/zh_CN";
import router from "./routers";
import "./App.css";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'

dayjs.locale("zh-cn");


dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.updateLocale("zh-cn", {
  weekStart: 0,
});

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "#1b88ff",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
