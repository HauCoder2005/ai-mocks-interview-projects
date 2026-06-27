"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import styles from "./interview-option-form.module.css";

export function InterviewOptionForm() {
  return (
    <Card>
      <CardContent>
        <form className={styles.form}>
          <div className={styles.fieldGrid}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="option-type">Option type</Label>
              <Select id="option-type" defaultValue="position">
                <option value="position">Position</option>
                <option value="level">Level</option>
                <option value="technology">Technology</option>
                <option value="topic">Topic</option>
              </Select>
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="option-name">Name</Label>
              <Input id="option-name" placeholder="Frontend Developer, Senior, React..." />
            </div>
          </div>
          <Button className={styles.submitButton} type="button">
            Add option
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
