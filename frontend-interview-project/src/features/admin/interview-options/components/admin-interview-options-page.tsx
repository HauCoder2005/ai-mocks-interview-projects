import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { InterviewOptionType } from "@/features/admin/interview-options/types";

const optionTypes: Array<{ type: InterviewOptionType; label: string; description: string }> = [
  { type: "position", label: "Positions", description: "Frontend, Backend, Full-stack..." },
  { type: "level", label: "Levels", description: "Intern, Junior, Middle, Senior..." },
  { type: "technology", label: "Technologies", description: "React, Node.js, NestJS..." },
  { type: "topic", label: "Topics", description: "System design, performance, testing..." },
];

export function AdminInterviewOptionsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader
        title="Interview Options"
        description="Configure the option sets used by candidate interview setup flows."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {optionTypes.map((option) => (
          <Card key={option.type}>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-950">{option.label}</h2>
                  <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                </div>
                <Badge>{option.type}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
