import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
// import { usePermisstionQuery } from "../../modules/permissions/useQuery"; // TODO: tạm tắt, bật lại khi api.checkPermission sẵn sàng

type ButtonVariant = "primary" | "danger" | "default" | "transaction";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  module_name?: string;
  action?: string;
  isLoading?: boolean;
  classColorSpin?: string;
  htmlType?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  children,
  module_name,
  action,
  className,
  onClick,
  isLoading = false,
  disabled,
  classColorSpin,
  htmlType = "button",
  ...props
}) => {
  const baseStyle =
    variant === "transaction"
      ? ""
      : "px-4 py-2  flex items-center justify-center rounded transition-colors duration-200 gap-2";
  //  flex items-center justify-center

  const variantStyle: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    danger: "bg-red-500 text-white hover:bg-red-600",
    default: "bg-gray-100 text-black hover:bg-gray-200",
    transaction: "bg-transparent p-0",
  };

  // TODO: bật lại khi api.checkPermission sẵn sàng
  // const { mutate: mutateCheckPermisstion } = usePermisstionQuery.useCheckPermisstion(
  //   (res) => {
  //     if (res?.data?.has_permission && onClick && lastEventRef.current) {
  //       onClick(lastEventRef.current);
  //     }
  //   },
  //   (error) => {
  //     console.error("Không có quyền truy cập", error);
  //   }
  // );

  // const lastEventRef = React.useRef<React.MouseEvent<HTMLButtonElement> | null>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // if (isLoading || disabled) return; // chặn spam khi loading

    // if (module_name && action) {
    //   e.preventDefault();
    //   e.persist?.();
    //   lastEventRef.current = e;
    //   mutateCheckPermisstion({ module_name, action });
    // } else if (onClick) {
    if (isLoading || disabled) return;
    if (onClick) {
      onClick(e);
    }
  };

  const antLoadingIcon = <LoadingOutlined style={{ fontSize: 16 }} spin color="" />;
  const spinColorClass =
    variant === "primary" || variant === "danger" ? "!text-white" : "!text-blue-500";

  return (
    <button
      type={htmlType}
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`
        relative select-none
        ${baseStyle}
        ${variantStyle[variant]}
        ${disabled || isLoading ? "opacity-70 cursor-not-allowed" : ""}
        ${className || ""}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Spin
            indicator={antLoadingIcon}
            size="small"
            className={classColorSpin ? classColorSpin : spinColorClass}
          />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
