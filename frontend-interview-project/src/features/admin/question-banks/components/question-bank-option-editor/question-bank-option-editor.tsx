import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "./question-bank-option-editor.module.css";

export function QuestionBankOptionEditor() {
  return (
    <Card>
      <CardContent className={styles.content}>
        <div>
          <h3 className={styles.title}>MCQ options</h3>
          <p className={styles.description}>
            Add answer options here. The hook/API layer will own persistence when backend is wired.
          </p>
        </div>
        <div className={styles.options}>
          {[1, 2, 3, 4].map((optionNumber) => (
            <div className={styles.optionRow} key={optionNumber}>
              <div className={styles.fieldGroup}>
                <Label htmlFor={`option-${optionNumber}`}>Option {optionNumber}</Label>
                <Input id={`option-${optionNumber}`} placeholder="Answer content" />
              </div>
              <label className={styles.checkboxLabel}>
                <input className={styles.checkbox} type="checkbox" />
                Correct
              </label>
            </div>
          ))}
        </div>
        <Button className={styles.addButton} type="button" variant="outline">
          Add option
        </Button>
      </CardContent>
    </Card>
  );
}
