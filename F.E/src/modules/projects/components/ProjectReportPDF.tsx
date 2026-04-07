import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { formatDate } from "../../../core/utils/formatDate";
import type { IProject } from "../types";
import type { ITask } from "../../tasks/types";

// Register Font for Vietnamese support (Roboto)
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
});

Font.register({
  family: "RobotoBold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#333",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    paddingBottom: 10,
  },
  projectTitle: {
    fontSize: 24,
    fontFamily: "RobotoBold",
    color: "#1e40af",
    marginBottom: 4,
  },
  projectCode: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 10,
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "RobotoBold",
    color: "#1e40af",
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    paddingLeft: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 120,
    color: "#6b7280",
    fontFamily: "RobotoBold",
  },
  value: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 4,
    marginTop: 10,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "RobotoBold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    marginTop: 2,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    padding: 8,
    color: "#fff",
    fontFamily: "RobotoBold",
    borderRadius: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    padding: 8,
    alignItems: "center",
  },
  col1: { width: "40%" },
  col2: { width: "20%", textAlign: "center" },
  col3: { width: "20%", textAlign: "center" },
  col4: { width: "20%", textAlign: "right" },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    fontSize: 8,
    textTransform: "uppercase",
    fontFamily: "RobotoBold",
    textAlign: "center",
  },
  status_todo: { backgroundColor: "#f3f4f6", color: "#6b7280" },
  status_in_progress: { backgroundColor: "#dbeafe", color: "#1e40af" },
  status_blocked: { backgroundColor: "#fee2e2", color: "#991b1b" },
  status_done: { backgroundColor: "#dcfce7", color: "#166534" },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  }
});

const statusMap: Record<string, string> = {
  active: "Đang hoạt động",
  completed: "Đã hoàn thành",
  on_hold: "Tạm dừng",
  cancelled: "Đã hủy",
};

const taskStatusMap: Record<string, string> = {
  todo: "Cần làm",
  in_progress: "Đang làm",
  blocked: "Đang chặn",
  done: "Hoàn thành",
};

interface IProps {
  project: IProject;
  tasks: ITask[];
}

export const ProjectReportPDF = ({ project, tasks }: IProps) => {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const blockedTasks = tasks.filter(t => t.status === "blocked").length;

  return (
    <Document title={`Báo cáo dự án - ${project.name}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.projectTitle}>{project.name}</Text>
          <Text style={styles.projectCode}>Mã dự án: {project.code}</Text>
        </View>

        {/* General Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chung</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text style={styles.value}>{statusMap[project.status] || "---"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ngày bắt đầu:</Text>
            <Text style={styles.value}>{project.expected_start_date ? formatDate(project.expected_start_date) : "---"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ngày kết thúc:</Text>
            <Text style={styles.value}>{project.expected_end_date ? formatDate(project.expected_end_date) : "---"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Chủ sở hữu:</Text>
            <Text style={styles.value}>{project.owner_name}</Text>
          </View>
          {project.description && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>Mô tả:</Text>
              <Text style={[styles.value, { marginTop: 4, color: "#4b5563" }]}>{project.description}</Text>
            </View>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiến độ hiện tại</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{progress}%</Text>
              <Text style={styles.statLabel}>Hoàn thành</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Tổng số Task</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{doneTasks}</Text>
              <Text style={styles.statLabel}>Đã xong</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{inProgressTasks}</Text>
              <Text style={styles.statLabel}>Đang làm</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{blockedTasks}</Text>
              <Text style={styles.statLabel}>Đang chặn</Text>
            </View>
          </View>
        </View>

        {/* Task List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh sách chi tiết công việc</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Tên công việc</Text>
              <Text style={styles.col2}>Trạng thái</Text>
              <Text style={styles.col3}>Phụ trách</Text>
              <Text style={styles.col4}>Hạn chót</Text>
            </View>
            {tasks.map((task, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{task.title}</Text>
                <View style={styles.col2}>
                   <Text style={[styles.statusBadge, styles[`status_${task.status}` as keyof typeof styles]]}>
                    {taskStatusMap[task.status]}
                   </Text>
                </View>
                <Text style={styles.col3}>{task.assignees?.map(a => a.name).join(", ") || "---"}</Text>
                <Text style={styles.col4}>{task.due_date ? formatDate(task.due_date) : "---"}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Báo cáo được tạo bởi TaskFlow - Trang ${pageNumber} / ${totalPages} - ${new Date().toLocaleString("vi-VN")}`
        )} fixed />
      </Page>
    </Document>
  );
};
