import React from "react";
import { Input as InputAnt, type InputProps } from "antd";
// import { usePermisstionQuery } from "../../modules/permissions/useQuery";

interface InputCustomProps extends InputProps {
  module_name?: string;
  action?: string;
}

const Input: React.FC<InputCustomProps> = ({ module_name, action, onChange, ...props }) => {

  // const { mutate: mutateCheckPermisstion } =
  //   usePermisstionQuery.useCheckPermisstion(
  //     (res) => {
  //       if (res?.data?.has_permission && onChange && lastArgsRef.current) {
  //         const [event] = lastArgsRef.current;
  //         onChange(event);
  //       }
  //     },
  //     (error) => {
  //       console.error("Permission denied:", error);
  //     }
  //   );

  // const lastArgsRef = React.useRef<[React.ChangeEvent<HTMLInputElement>] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // Nếu muốn bật lại permission thì mở block này
    /*
    if (module_name && action) {
      lastArgsRef.current = [e];
      mutateCheckPermisstion({ module_name, action });
      return;
    }
    */

    // hiện tại cho chạy thẳng luôn
    if (onChange) {
      onChange(e);
    }
  };

  return <InputAnt {...props} onChange={handleChange} />;
};

export default Input;