import { useState } from "react";

export const useGetList = <T, P>(
    queryHook: (params: P) => {
        data?: { data: T[]; pagination?: any };
        isLoading: boolean;
    },
    defaultParams: P,
) => {

    if (!queryHook) return {} as any;

    const [params, setParams] = useState<P>(defaultParams);

    const { data: dataQuery, isLoading } = queryHook(params);

    const handleSearch = (search: Partial<P>) => {

        setParams((prev) => ({
            ...prev,
            ...search,
            page: 1,
        }));
    };

    const handlePageChange = (page: number, limit: number) => {
        setParams((prev) => ({
            ...prev,
            page,
            limit,
        }));
    };

    return {
        params,
        setParams,
        data: dataQuery?.data || [],
        pagination: dataQuery?.pagination,
        isLoading: isLoading,
        handleSearch,
        handlePageChange,
    };
};
