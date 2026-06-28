import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import type { AdminInterviewOption } from "@/features/admin/interview-options/types";
import styles from "./interview-option-table.module.css";

type InterviewOptionTableProps = {
  options: AdminInterviewOption[];
  onActivate: (option: AdminInterviewOption) => void;
  onDeactivate: (option: AdminInterviewOption) => void;
  onEdit: (option: AdminInterviewOption) => void;
};

export function InterviewOptionTable({
  onActivate,
  onDeactivate,
  onEdit,
  options,
}: InterviewOptionTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Code</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr key={`${option.type}-${option.id}`}>
              <Td>
                <div>
                  <p className={styles.optionName}>{option.name}</p>
                  {option.description ? (
                    <p className={styles.optionDescription}>{option.description}</p>
                  ) : null}
                </div>
              </Td>
              <Td>
                <Badge variant="primary">{option.type}</Badge>
              </Td>
              <Td>{option.code ?? option.slug ?? "-"}</Td>
              <Td>
                <Badge variant={option.isActive ? "success" : "default"}>
                  {option.isActive ? "Active" : "Inactive"}
                </Badge>
              </Td>
              <Td>
                <div className={styles.actions}>
                  <Button onClick={() => onEdit(option)} size="sm" type="button" variant="outline">
                    Edit
                  </Button>
                  {option.isActive ? (
                    <Button
                      onClick={() => onDeactivate(option)}
                      size="sm"
                      type="button"
                      variant="danger"
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onActivate(option)}
                      size="sm"
                      type="button"
                      variant="secondary"
                    >
                      Activate
                    </Button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
