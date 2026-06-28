import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import type { AdminQuestionBank } from "@/features/admin/question-banks/types";
import styles from "./question-bank-table.module.css";

type QuestionBankTableProps = {
  questions: AdminQuestionBank[];
  onDelete: (question: AdminQuestionBank) => void;
  onEdit: (question: AdminQuestionBank) => void;
};

export function QuestionBankTable({ onDelete, onEdit, questions }: QuestionBankTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Title</Th>
          <Th>Type</Th>
          <Th>Difficulty</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {questions.map((question) => (
          <tr key={question.id}>
            <Td>
              <div>
                <p className={styles.questionTitle}>{question.title}</p>
                <p className={styles.questionMeta}>
                  {question.technology ?? question.topic ?? "-"}
                </p>
              </div>
            </Td>
            <Td>{question.type ?? question.questionType}</Td>
            <Td>{question.difficulty}</Td>
            <Td>
              <Badge variant={question.isActive ? "success" : "default"}>
                {question.isActive ? "Active" : "Inactive"}
              </Badge>
            </Td>
            <Td>
              <div className={styles.actions}>
                <Button onClick={() => onEdit(question)} size="sm" type="button" variant="outline">
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(question)}
                  size="sm"
                  type="button"
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
