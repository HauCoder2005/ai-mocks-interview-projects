import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import type { AdminQuestionBank } from "@/features/admin/question-banks/types";

const sampleQuestionBanks: AdminQuestionBank[] = [
  {
    id: "sample-1",
    title: "React rendering fundamentals",
    type: "technical",
    difficulty: "medium",
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
                <p className="font-medium text-slate-950">{question.title}</p>
                <p className="text-xs text-slate-500">{question.technology}</p>
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
