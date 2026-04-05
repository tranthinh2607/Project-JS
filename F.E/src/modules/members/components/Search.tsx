import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../core/layouts";
import { Input } from "antd";
import { useState } from "react";

interface IProps {
  handleSearch: (value: any) => void;
}

const defaultParams = {
  keyword: "",
};

function Search({ handleSearch }: IProps) {
  const [dataSearch, setDataSearch] = useState(defaultParams);

  const clickSearch = () => {
    handleSearch(dataSearch);
  };

  const clickReload = () => {
    setDataSearch(defaultParams);
    handleSearch(defaultParams);
  };

  return (
    <div className="flex justify-between gap-2">
      <div className="flex items-center gap-2 font-medium text-gray-700">
        Bộ lọc
      </div>
      <div className="flex justify-end gap-2 ">
        <Input
          value={dataSearch?.keyword}
          onChange={(e) => {
            if (e.target.value === "") {
              handleSearch({ ...dataSearch, keyword: undefined });
            }
            setDataSearch((prev) => ({ ...prev, keyword: e.target.value }))
          }}
          onPressEnter={clickSearch}
          placeholder="Tìm theo email hoặc tên..."
          className="!w-64"
        />
        <Button onClick={clickSearch} className="!p-2 h-8 w-8" variant="primary">
          <MagnifyingGlassIcon className="h-4 mx-auto" />
        </Button>
        <Button onClick={clickReload} className="!p-2 h-8 w-8">
          <ArrowPathIcon className="h-4 mx-auto" />
        </Button>
      </div>
    </div>
  );
}

export default Search;
