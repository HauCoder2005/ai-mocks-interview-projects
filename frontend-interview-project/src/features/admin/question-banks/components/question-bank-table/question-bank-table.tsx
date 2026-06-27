import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import type { AdminQuestionBank } from "@/features/admin/question-banks/types";
import styles from "./question-bank-table.module.css";

const sampleQuestionBanks: AdminQuestionBank[] = [
  {
    id: "sample-1",
    title: "React rendering fundamentals",
    content: "Explain how React renders server and client components.",
    type: "THEORY",
    difficulty: "MEDIUM",
    technology: "React",
    topic: "Frontend",
    isActive: true,
  },
];

export function QuestionBankTable() {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Title</Th>
          <Th>Type</Th>
          <Th>Difficulty</Th>
          <Th>Status</Th>
        </tr>
      </thead>
      <tbody>
        {sampleQuestionBanks.map((question) => (
          <tr key={question.id}>
            <Td>
              <div>
                <p className={styles.questionTitle}>{question.title}</p>
                <p className={styles.questionMeta}>{question.technology}</p>
              </div>
            </Td>
            <Td>{question.type}</Td>
            <Td>{question.difficulty}</Td>
            <Td>
              <Badge>{question.isActive ? "Active" : "Inactive"}</Badge>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
