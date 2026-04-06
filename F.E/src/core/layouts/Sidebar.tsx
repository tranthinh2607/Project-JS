

import { Bars3BottomLeftIcon, ChartBarIcon, ChevronDoubleRightIcon, Cog6ToothIcon, CubeIcon, DocumentTextIcon, FolderIcon, ReceiptRefundIcon, ShoppingCartIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";



interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeKey = pathname.split("/")[1] || "dashboard";

  return (
    <Sider
      collapsed={isOpen}
      width={250}
      trigger={null}
      collapsible={false}
      className="h-full shadow-lg !fixed top-0 left-0 z-20"
      theme="light"
    >
      {/* LOGO + TOGGLE */}
      <div className="flex items-center justify-center px-10 pt-3 relative">

        {/* <img
          src="/assets/images/logo/logo.png"
          alt="Logo"
          className="h-[70px] mx-auto object-contain min-w-[40px]"
        /> */}
        <h1 className="text-2xl font-bold">Task Flow</h1>
        <div className="absolute top-1/2 -translate-y-1/2 -right-3">
          <motion.button
            onClick={onToggle}
            className="flex items-center justify-center bg-white p-1 rounded-md border border-gray-100"
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <Bars3BottomLeftIcon className="w-4 h-4 text-gray-700" />
            ) : (
              <ChevronDoubleRightIcon className="w-4 h-4 text-gray-700" />
            )}
          </motion.button>
        </div>
      </div>

      {/* MENU */}
      <div className="overflow-y-auto" style={{ height: "calc(100% - 70px)" }}>
        <Menu
          mode="inline"
          items={[
            {
              key: "dashboard",
              icon: <ChartBarIcon className="w-4 h-4" />,
              label: "Tổng quan",
            },
            {
              key: "projects",
              icon: <FolderIcon className="w-4 h-4" />,
              label: "Dự án",
            },
            {
              key: "tasks",
              icon: <DocumentTextIcon className="w-4 h-4" />,
              label: "Công việc",
            },
          ]}
          // onClick={handleMenuClick}
          className="border-none"
          selectedKeys={[activeKey]}
          onClick={(e) => {
            navigate(e.key);
          }}
        />
      </div>
    </Sider>
  );
}

export default Sidebar;
