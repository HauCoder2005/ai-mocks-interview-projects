import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import type { AdminInterviewOption } from "@/features/admin/interview-options/types";
import styles from "./interview-option-table.module.css";

const sampleOptions: AdminInterviewOption[] = [
  { id: "position-frontend", type: "position", name: "Frontend Developer", isActive: true },
  { id: "level-senior", type: "level", name: "Senior", isActive: true },
  { id: "technology-react", type: "technology", name: "React", isActive: true },
  { id: "topic-performance", type: "topic", name: "Performance", isActive: true },
];

export function InterviewOptionTable() {
  return (
    <div className={styles.tableWrapper}>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {sampleOptions.map((option) => (
            <tr key={option.id}>
              <Td>{option.name}</Td>
              <Td>
                <Badge variant="primary">{option.type}</Badge>
              </Td>
              <Td>
                <Badge variant={option.isActive ? "success" : "default"}>
                  {option.isActive ? "Active" : "Inactive"}
                </Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
