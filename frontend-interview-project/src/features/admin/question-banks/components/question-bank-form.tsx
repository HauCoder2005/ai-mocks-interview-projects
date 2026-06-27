"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function QuestionBankForm() {
  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="question-title">
          Question title
        </label>
        <Input id="question-title" placeholder="Explain React Server Components" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="question-type">
            Type
          </label>
          <Select id="question-type" defaultValue="technical">
            <option value="behavioral">Behavioral</option>
            <option value="technical">Technical</option>
            <option value="system-design">System design</option>
            <option value="coding">Coding</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="question-difficulty">
            Difficulty
          </label>
          <Select id="question-difficulty" defaultValue="medium">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </div>
      </div>
      <Button className="justify-self-start" type="button">
        Save draft
      </Button>
    </form>
  );
}
