import { useState } from "react";
import { Avatar, Input, List, Tooltip, Popconfirm, Empty, Spin } from "antd";
import { useTasksQuery } from "../useQuery";
import { formatDate } from "../../../core/utils/formatDate";
import { UserIcon, PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../core/layouts";
import toast from "react-hot-toast";
import { handleToastMessageErrors } from "../../../core/utils/toastMessageError";
import { formatAvatar } from "../../../core/utils/formatAvatar";

interface IProps {
  taskId: string;
}

function TaskComments({ taskId }: IProps) {
  const [content, setContent] = useState("");
  
  // Get current user from localStorage if needed, or better pass from parent
  // For now let's assume we can get it from the comment record comparison
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: commentsRes, isLoading, refetch } = useTasksQuery.useGetComments(taskId);
  const comments = (commentsRes as any)?.data || [];

  const { mutate: addComment, isPending: isAdding } = useTasksQuery.useAddComment(
    () => {
      toast.success("Đã thêm bình luận");
      setContent("");
      refetch();
    },
    (error) => handleToastMessageErrors(error)
  );

  const { mutate: deleteComment } = useTasksQuery.useDeleteComment(
    taskId,
    () => {
      toast.success("Đã xóa bình luận");
      refetch();
    },
    (error) => handleToastMessageErrors(error)
  );

  const handleSend = () => {
    if (!content.trim()) return;
    addComment({ taskId, content: content.trim() });
  };

  return (
    <div className="flex flex-col h-full max-h-[500px]">
      {/* Comment List */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : comments.length === 0 ? (
          <Empty description="Chưa có bình luận nào" className="py-10" />
        ) : (
          <List
            dataSource={comments}
            renderItem={(item: any) => (
              <List.Item
                className="group border-none px-0 py-3"
                actions={[
                  item.user_id?._id === currentUser._id && (
                    <Popconfirm
                      title="Xoá bình luận?"
                      onConfirm={() => deleteComment(item._id)}
                      okText="Xoá"
                      cancelText="Huỷ"
                    >
                      <button className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </Popconfirm>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={formatAvatar(item.user_id?.avatar)} 
                      icon={<UserIcon className="w-4 h-4" />} 
                      className="bg-blue-100 text-blue-600"
                    />
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{item.user_id?.name}</span>
                      <span className="text-xs text-gray-400 font-normal">{formatDate(item.createdAt)}</span>
                    </div>
                  }
                  description={
                    <div className="text-gray-700 bg-gray-50 p-2 rounded-lg mt-1 whitespace-pre-wrap">
                      {item.content}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
        <Avatar 
          src={formatAvatar(currentUser.avatar)} 
          icon={<UserIcon className="w-4 h-4" />} 
        />
        <div className="flex-1 flex gap-2">
          <Input.TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            isLoading={isAdding}
            disabled={!content.trim()}
            className="flex-shrink-0 !h-auto !py-2"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TaskComments;
