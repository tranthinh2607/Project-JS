import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import { useState } from "react";
import HeaderCustom from "./Header";
import ForbiddenModal from "./PorbiddenModal";

const { Content } = Layout;

function MasterLayout() {
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="h-screen w-screen" data-theme={theme}>
      <Layout className="h-full w-full">
        <Sidebar isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />

        <Layout>
          <HeaderCustom isOpen={isOpen} setTheme={setTheme} theme={theme} />

          <Content
            className={`bg-bg pt-6 p-5 pb-0 mt-[50px] transition-all duration-300 ${isOpen ? "ml-[80px]" : "ml-[250px]"
              }`}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <ForbiddenModal />
    </main>
  );
}

//
export default MasterLayout;
