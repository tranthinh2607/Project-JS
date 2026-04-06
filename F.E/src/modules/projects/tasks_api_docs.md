# Tasks API Documentation

Tài liệu hướng dẫn sử dụng các API quản lý Công việc (Tasks).

**Base URL:** `/api/tasks`

---

## 1. Danh sách Task của Dự án (Get Project Tasks)

Lấy danh sách các task cha (không bao gồm subtask trực tiếp, subtask được lấy qua API Detail).

*   **URL:** `/project/:projectId`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `keyword`: Tìm theo tiêu đề hoặc mô tả.
    *   `priority`: Lọc theo độ ưu tiên (`low`, `medium`, `high`).
*   **Auth Required:** Yes

### Response
```json
{
  "status": 200,
  "message": "Lấy danh sách task thành công",
  "data": [
    {
      "_id": "69ce2363051cee3eca61e216",
      "project_id": "69ba2654d516e9927be2a1a9",
      "title": "INTEGRATION_TEST_TASK",
      "description": "Test task for full flow",
      "priority": "high",
      "created_by": "69cd8a9c3ca61b56e7cd2a9f",
      "createdAt": "2026-04-02T08:05:55.105Z",
      "assignees": [
        {
          "_id": "69cd8a9c3ca61b56e7cd2a9f",
          "name": "Lại Nguyễn Thiên Bảo",
          "avatar": "..."
        }
      ],
      "subtask_count": 1,
      "created_name": "Lại Nguyễn Thiên Bảo",
      "status": "in_progress",
      "status_note": null,
      "priority_name": "Cao"
    }
  ]
}
```

---

## 2. Tạo Task / Subtask (Create)

*   **URL:** `/`
*   **Method:** `POST`
*   **Auth Required:** Yes

### Request Body
```json
{
  "project_id": "69ba2654d516e9927be2a1a9",
  "parent_task_id": null, // Hoặc ID task cha nếu là subtask
  "title": "Thiết kế UI",
  "description": "Mô tả chi tiết...",
  "priority": "high", 
  "start_date": "2024-04-10T00:00:00Z",
  "due_date": "2024-04-15T00:00:00Z"
}
```

---

## 3. Chi tiết Task & Subtasks (Detail)

*   **URL:** [/:id](file:///Users/macos/Documents/code/javascript/TaskFlow/B.E/src/modules/auth/auth.model.ts#10-14)
*   **Method:** `GET`
*   **Auth Required:** Yes

### Response
Trả về thông tin task và mảng `subtasks` chứa các task con (1 cấp).

---

## 4. Quản lý Trạng thái (Status)

### 4.1 Cập nhật Trạng thái (Change Status)
*   **URL:** `/:id/status`
*   **Method:** `POST`
*   **Body:** 
    ```json
    {
      "status": "blocked", // todo, in_progress, blocked, done
      "note": "Lý do nếu blocked" // Bắt buộc khi status = blocked
    }
    ```

### 4.2 Lịch sử Trạng thái (History)
*   **URL:** `/:id/status-history`
*   **Method:** `GET`

---

## 5. Người thực hiện (Assignees)

### 5.1 Giao việc (Assign)
*   **URL:** `/:id/assign`
*   **Method:** `POST`
*   **Body:** `{ "user_id": "69cd8a9..." }`

### 5.2 Hủy giao việc (Unassign)
*   **URL:** `/:id/assign/:userId`
*   **Method:** `DELETE`

---

## 6. Danh sách kiểm tra (Checklists)

### 6.1 Thêm Item
*   **URL:** `/:id/checklists`
*   **Method:** `POST`
*   **Body:** `{ "title": "Nội dung item" }`

### 6.2 Lấy danh sách Checklist
*   **URL:** `/:id/checklists`
*   **Method:** `GET`

### 6.3 Hoàn thành / Hủy hoàn thành (Toggle)
*   **URL:** `/:id/checklists/:itemId`
*   **Method:** `PATCH`
*   **Body:** `{ "is_completed": true }`

### 6.4 Xóa Item
*   **URL:** `/:id/checklists/:itemId`
*   **Method:** `DELETE`
