"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import styles from "./dashboard-charts.module.css";

export type PieChartDatum = {
  name: string;
  value: number;
};

export type BarChartDatum = {
  name: string;
  value: number;
};

type DashboardChartsProps = {
  questionTypeData: PieChartDatum[];
  userVisitData: BarChartDatum[];
  visitsNote?: string;
};

const chartColors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

export function DashboardCharts({
  questionTypeData,
  userVisitData,
  visitsNote,
}: DashboardChartsProps) {
  return (
    <div className={styles.chartGrid}>
      <Card>
        <CardContent className={styles.chartCard}>
          <div>
            <h2 className={styles.chartTitle}>Question Types</h2>
            <p className={styles.chartDescription}>Distribution from question banks.</p>
          </div>
          <div className={styles.chartFrame}>
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  data={questionTypeData}
                  dataKey="value"
                  innerRadius={56}
                  nameKey="name"
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {questionTypeData.map((entry, index) => (
                    <Cell
                      fill={chartColors[index % chartColors.length]}
                      key={entry.name}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className={styles.chartCard}>
          <div>
            <h2 className={styles.chartTitle}>Users & Visits</h2>
            <p className={styles.chartDescription}>
              Users from backend; visits require a statistics endpoint.
            </p>
          </div>
          <div className={styles.chartFrame}>
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={userVisitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {visitsNote ? <p className={styles.note}>{visitsNote}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
