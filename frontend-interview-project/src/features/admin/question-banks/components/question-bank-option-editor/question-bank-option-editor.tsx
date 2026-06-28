import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuestionBankOption } from "@/features/admin/question-banks/types";
import styles from "./question-bank-option-editor.module.css";

type QuestionBankOptionEditorProps = {
  options: QuestionBankOption[];
  onChange: (options: QuestionBankOption[]) => void;
};

const emptyOption: QuestionBankOption = {
  content: "",
  isCorrect: false,
  explanation: "",
};

export function QuestionBankOptionEditor({
  onChange,
  options,
}: QuestionBankOptionEditorProps) {
  function updateOption(index: number, nextOption: Partial<QuestionBankOption>) {
    onChange(
      options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, ...nextOption } : option,
      ),
    );
  }

  return (
    <Card>
      <CardContent className={styles.content}>
        <div>
          <h3 className={styles.title}>MCQ options</h3>
          <p className={styles.description}>Add answer options and mark the correct answer.</p>
        </div>
        <div className={styles.options}>
          {options.map((option, index) => (
            <div className={styles.optionRow} key={index}>
              <div className={styles.fieldGroup}>
                <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                <Input
                  id={`option-${index}`}
                  onChange={(event) => updateOption(index, { content: event.target.value })}
                  placeholder="Answer content"
                  value={option.content}
                />
              </div>
              <label className={styles.checkboxLabel}>
                <input
                  checked={option.isCorrect}
                  className={styles.checkbox}
                  onChange={(event) => updateOption(index, { isCorrect: event.target.checked })}
                  type="checkbox"
                />
                Correct
              </label>
            </div>
          ))}
        </div>
        <Button
          className={styles.addButton}
          onClick={() => onChange([...options, { ...emptyOption }])}
          type="button"
          variant="outline"
        >
          Add option
        </Button>
      </CardContent>
    </Card>
  );
}
