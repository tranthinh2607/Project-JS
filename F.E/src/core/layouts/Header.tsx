import {
  BellIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Dropdown, Menu, Modal } from "antd";
import { Link } from "react-router-dom";
import { clearTokens } from "../utils/cookies";
import { useState, useEffect } from "react";
import { useAuthQuery } from "../../modules/auth/useQuery";

interface IProps {
  setTheme: (theme: string) => void;
  theme: string;
  isOpen: boolean;
}

function HeaderCustom({ setTheme, theme, isOpen }: IProps) {
  const { data } = useAuthQuery.useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  const dropdownMenu = [{
    key: "profile",
    label: (
      <Link
        to="/profile"
        className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
      >
        <UserIcon className="w-6 h-6" />
        <span>Thông tin tài khoản</span>
      </Link>
    ),
  },
  {
    key: "settings",
    label: (
      <Link
        to="/settings"
        className="flex items-center gap-2 text-gray-700 hover:text-blue-500"
      >
        <Cog6ToothIcon className="w-6 h-6" />
        <span>Cài đặt</span>
      </Link>
    ),
  },
  {
    key: "logout",
    label: (
      <div className="flex items-center gap-2 text-red-600 hover:text-red-500">
        <ArrowRightOnRectangleIcon className="w-6 h-6" />
        <span>Đăng xuất</span>
      </div>
    ),
    onClick: () => setIsModalOpen(true),
  },
  ]
  const handleLogout = () => {
    clearTokens();
    window.location.href = "/";
  };
  return (
    <>
      <div
        className={`flex items-center justify-end gap-5 pr-5 fixed top-0 pt-5 bg-white left-0 right-0 transition-all duration-300 z-10 ${isOpen ? "pl-[110px]" : "pl-[280px]"}`}
      >
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col items-center justify-center rounded-full px-4 py-2 transition-colors bg-[#F5F5F5]">
            <span className="text-xs text-gray-500">{formatDate(currentTime)}</span>
          </div>

        </div>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex items-center justify-center rounded-full p-3 transition-colors bg-[#F5F5F5]"
        >
          {theme === "light" ? (
            <MoonIcon className="w-6 h-6 text-gray-500" />
          ) : (
            <SunIcon className="w-6 h-6 text-gray-500" />
          )}
        </button>

        <button className="relative flex items-center justify-center rounded-full p-3 transition-colors bg-[#F5F5F5]">
          <BellIcon className="w-6 h-6 text-gray-500" />
          <span className="absolute -top-1 -right-1 bg-red-400 text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            10
          </span>
        </button>

        <Dropdown
          menu={{ items: dropdownMenu }}
          trigger={["click"]}
          placement="bottomRight">
          <div className="flex gap-2 items-center cursor-pointer pr-3 bg-[#F5F5F5] p-2 rounded-full">
            <Avatar src="/assets/images/logo/favicon.png" className="h-8 w-8 " alt="avatar" />
            <div className="flex flex-col h-8 justify-between text-left">
              <p className="text-gray-700 font-semibold">{data?.name}</p>
              <div className="flex items-center gap-1 justify-between">
                <span className="text-gray-700 text-[10px]">{data?.role_name || "Nhân viên"}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Dropdown>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="Đăng xuất"
        centered
      >
        <div className="flex flex-col gap-2">
          <p className="text-gray-700">Bạn có chắc chắn muốn đăng xuất?</p>
          <div className="flex gap-2 justify-end">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default HeaderCustom;
