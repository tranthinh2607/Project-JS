import { Select, Spin } from "antd";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";

interface IProps {
  placeholder: string;
  onChange?: (value: any) => void;
  useQuery: any;
  disabled?: boolean;
  value?: string | number;
  label?: string;
  varLabel?: string;
  className?: string;
  varSearch?: string;
  useKey?: string;
  extraParams?: Record<string, any>;
}
interface IParams {
  page: number;
  limit: number;
  keyword?: string;
  key?: string;
}

const DEFAULT_PARAMS: IParams = {
  page: 1,
  limit: 10,
};

// debounce tự viết, không dùng lodash
function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timer = useRef<any>(null);

  const debouncedFn = useCallback(
    (...args: any[]) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedFn;
}

function SearchableInfiniteSelect({
  placeholder = "Chọn",
  onChange,
  useQuery,
  disabled = false,
  value,
  label,
  varLabel = "name",
  className = "",
  varSearch = "key",
  useKey = "useGetAll",
  extraParams,
}: IProps) {
  const [params, setParams] = useState<IParams>(DEFAULT_PARAMS);
  const [allItems, setAllItems] = useState<any[]>([]);

  const { data: dataRes, isFetching } = useQuery[useKey]({ ...params, ...extraParams });

  // append data khi đổi page, reset khi search
  useEffect(() => {
    const data = dataRes?.data || [];
    if (params.page === 1) {
      setAllItems(data);
    } else {
      setAllItems((prev) => [...prev, ...data]);
    }
  }, [dataRes, params.page]);

  // check còn page hay không
  const hasMore = useMemo(() => {
    if (!dataRes?.pagination) return false;
    return params.page < dataRes.pagination.totalPage;
  }, [dataRes, params.page]);

  // scroll load more
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (
        hasMore &&
        !isFetching &&
        target.scrollTop + target.offsetHeight >= target.scrollHeight - 50
      ) {
        setParams((prev) => ({ ...prev, page: prev.page + 1 }));
      }
    },
    [hasMore, isFetching]
  );

  // debounce search (custom)
  const handleSearch = useDebounce((value: string) => {
    setParams({ ...DEFAULT_PARAMS, [`${varSearch}`]: value || undefined });
  }, 300);

  // memo hóa options
  const options = useMemo(
    () => allItems.map((item: any) => ({ value: item.id, label: item[varLabel] })),
    [allItems]
  );

  return (
    // <Select
    //     showSearch
    //     placeholder={placeholder}
    //     options={options}
    //     value={value}
    //     labelInValue
    //     onChange={(value) => onChange && onChange(allItems.find((item: any) => item.id === value.value))}
    //     disabled={disabled}
    //     filterOption={false}
    //     allowClear
    //     onSearch={handleSearch}
    //     onPopupScroll={handleScroll}
    //     notFoundContent={isFetching ? <Spin size="small" /> : null}
    //     style={{ width: "100%" }}
    // />
    <Select
      className={className}
      showSearch
      placeholder={placeholder}
      options={options}
      value={label && value ? { value, label } : null}
      labelInValue
      onChange={(val) => {
        // AntD đã trả { value, label }
        // => ông muốn gắn lại object full thì tùy
        if (!val) setParams(DEFAULT_PARAMS);
        onChange?.({
          id: val?.value || null,
          ...allItems.find((item: any) => item.id === val?.value), // nếu có thì merge thêm info
        });
      }}
      disabled={disabled}
      filterOption={false}
      allowClear
      onSearch={handleSearch}
      onPopupScroll={handleScroll}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
      style={{ width: "100%" }}
    />
  );
}

export default SearchableInfiniteSelect;
