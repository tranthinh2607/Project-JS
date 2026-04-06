import {
  BanknotesIcon,
  BriefcaseIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "antd";
import { useState } from "react";
import { ProfileInfo, Security } from "../Tabs";
import { useAuthQuery } from "../useQuery";
import { useLoadingToast } from "../../../core/utils/useLoadingToast";

function ProfilePage() {
  const [tabs, setTabs] = useState<"profile" | "security">(
    "profile"
  );

  const { data: dataProfile, isLoading } = useAuthQuery.useProfile();
  const ItemsTabs = [
    {
      key: "profile",
      label: "Thông tin cơ bản",
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      key: "security",
      label: "Bảo mật",
      icon: <LockClosedIcon className="w-5 h-5" />,
    },
  ];

  useLoadingToast(isLoading, "Đang tải hồ sơ...", "profile-loading");

  return (
    <div className="flex flex-col gap-3 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white  flex gap-4 items-center ">
        <Avatar size={65} src="/assets/images/logo/favicon.png" className="bg-primary/10" alt="avatar" />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-800">{dataProfile?.name || "---"}</h2>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-4 border-t border-gray-100 ">
        {/* Sidebar */}
        <div className="bg-white rounded-md overflow-hidden flex flex-col h-full border-r border-gray-100">
          {/* Tiêu đề */}
          <div className="p py-2 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Cài đặt tài khoản</h3>
            <p className="text-xs text-gray-500">Quản lý thông tin & bảo mật</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-col py-3 pr-3">
            {ItemsTabs.map((item) => {
              const isActive = tabs === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setTabs(item.key as "profile" | "security")}
                  className={`group relative flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg  transition-all
                    ${isActive
                      ? "bg-primary/10 text-primary font-medium ring-1 ring-inset ring-primary/30"
                      : "hover:bg-gray-50 text-gray-700"
                    }
                  `}
                >
                  {/* Active bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full"></span>
                  )}

                  <span
                    className={`${isActive ? "text-primary" : "text-gray-400 group-hover:text-primary"} transition-colors`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-md p-3 py-5 col-span-3 relative ">
          <div className="h-[1px] bg-gray-100 absolute top-14.5 right-0 w-full" />
          {tabs === "profile" && <ProfileInfo dataProfile={dataProfile} />}
          {tabs === "security" && <Security dataProfile={dataProfile} />}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
