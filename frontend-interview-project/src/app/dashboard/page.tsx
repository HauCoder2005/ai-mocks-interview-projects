import {
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck2,
  ChartNoAxesColumnIncreasing,
  ChevronRight,
  Clock3,
  FileBadge2,
  Flame,
  Medal,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import React from "react";

import Navbar from "@/src/components/common/Navbar";

type StatCard = {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  accent: string;
};

type Activity = {
  title: string;
  date: string;
  score: string;
  status: string;
};

type SuggestedJob = {
  title: string;
  company: string;
  match: string;
  location: string;
};

const stats: StatCard[] = [
  {
    label: "Tổng số bài phỏng vấn",
    value: "18",
    helper: "+4 bài trong tháng này",
    icon: <BarChart3 size={26} strokeWidth={2.3} />,
    accent: "#2563eb",
  },
  {
    label: "Điểm trung bình",
    value: "82",
    helper: "Tăng 11 điểm sau 30 ngày",
    icon: <TrendingUp size={26} strokeWidth={2.3} />,
    accent: "#7c3aed",
  },
  {
    label: "Điểm CV hiện tại",
    value: "76",
    helper: "Cần tối ưu phần impact",
    icon: <FileBadge2 size={26} strokeWidth={2.3} />,
    accent: "#0f766e",
  },
];

const recentActivities: Activity[] = [
  {
    title: "Frontend React Interview",
    date: "Hôm nay, 09:30",
    score: "86/100",
    status: "Strong hire signal",
  },
  {
    title: "System Design Practice",
    date: "Hôm qua, 20:15",
    score: "78/100",
    status: "Cần rõ trade-off hơn",
  },
  {
    title: "Behavioral Leadership",
    date: "15/06/2026, 18:40",
    score: "83/100",
    status: "Câu chuyện tốt",
  },
];

const suggestedJobs: SuggestedJob[] = [
  {
    title: "Senior Frontend Engineer",
    company: "NovaCloud",
    match: "94%",
    location: "Remote",
  },
  {
    title: "React Platform Developer",
    company: "BluePeak AI",
    match: "89%",
    location: "Ho Chi Minh",
  },
  {
    title: "Fullstack Product Engineer",
    company: "BrightLab",
    match: "86%",
    location: "Hybrid",
  },
];

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 30%), radial-gradient(circle at top right, rgba(124, 58, 237, 0.14), transparent 28%), #f8fafc",
  color: "#1e293b",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const mainStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "42px 24px 88px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "28px",
};

const bannerStyle: React.CSSProperties = {
  overflow: "hidden",
  position: "relative",
  borderRadius: "28px",
  background:
    "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 64, 175, 0.94) 52%, rgba(124, 58, 237, 0.92) 100%)",
  boxShadow: "0 24px 60px -28px rgba(15, 23, 42, 0.55)",
  color: "#ffffff",
  padding: "34px",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gap: "28px",
  alignItems: "center",
};

const bannerContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const badgeStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 12px",
  borderRadius: "999px",
  backgroundColor: "rgba(255, 255, 255, 0.13)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  color: "#dbeafe",
  fontSize: "13px",
  fontWeight: 850,
};

const bannerTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "40px",
  fontWeight: 900,
  lineHeight: 1.12,
  letterSpacing: "0",
};

const bannerTextStyle: React.CSSProperties = {
  margin: 0,
  maxWidth: "690px",
  color: "#dbeafe",
  fontSize: "16px",
  lineHeight: 1.75,
};

const levelRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "12px",
  paddingTop: "6px",
};

const levelPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  minHeight: "42px",
  padding: "0 14px",
  borderRadius: "999px",
  backgroundColor: "rgba(255, 255, 255, 0.14)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 800,
};

const avatarWrapStyle: React.CSSProperties = {
  width: "138px",
  height: "138px",
  borderRadius: "999px",
  padding: "5px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(191,219,254,0.72))",
  boxShadow: "0 22px 42px -24px rgba(0, 0, 0, 0.6)",
};

const avatarStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "999px",
  objectFit: "cover",
  display: "block",
};

const statsRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "20px",
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(226, 232, 240, 0.94)",
  borderRadius: "22px",
  boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.08)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const statTopStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
};

const statIconStyle: React.CSSProperties = {
  width: "54px",
  height: "54px",
  borderRadius: "17px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const statLabelStyle: React.CSSProperties = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
  fontWeight: 750,
};

const statValueStyle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#0f172a",
  fontSize: "36px",
  fontWeight: 950,
  lineHeight: 1,
};

const helperStyle: React.CSSProperties = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
  lineHeight: 1.55,
};

const contentGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.35fr) minmax(300px, 0.65fr)",
  gap: "22px",
  alignItems: "start",
};

const panelStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(226, 232, 240, 0.94)",
  borderRadius: "24px",
  boxShadow: "0 10px 15px -3px rgba(15, 23, 42, 0.08)",
  padding: "26px",
};

const panelHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "18px",
  marginBottom: "18px",
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: "22px",
  fontWeight: 900,
  lineHeight: 1.25,
};

const panelActionStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  color: "#2563eb",
  fontSize: "14px",
  fontWeight: 850,
};

const activityListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const activityItemStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
  gap: "14px",
  alignItems: "center",
  padding: "16px",
  borderRadius: "18px",
  backgroundColor: "#f8fafc",
  border: "1px solid #eef2f7",
};

const timelineIconStyle: React.CSSProperties = {
  width: "44px",
  height: "44px",
  borderRadius: "15px",
  backgroundColor: "rgba(37, 99, 235, 0.09)",
  color: "#2563eb",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const activityTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: 850,
  lineHeight: 1.35,
};

const activityMetaStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: 1.45,
};

const scoreStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  backgroundColor: "rgba(15, 118, 110, 0.1)",
  color: "#0f766e",
  fontSize: "13px",
  fontWeight: 900,
  padding: "8px 10px",
  whiteSpace: "nowrap",
};

const jobListStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const jobCardStyle: React.CSSProperties = {
  padding: "16px",
  borderRadius: "18px",
  background:
    "linear-gradient(180deg, rgba(248,250,252,0.98) 0%, rgba(255,255,255,0.98) 100%)",
  border: "1px solid #eef2f7",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const jobTopStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "12px",
};

const jobTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: "15px",
  fontWeight: 900,
  lineHeight: 1.35,
};

const companyStyle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: "13px",
  lineHeight: 1.45,
};

const matchStyle: React.CSSProperties = {
  borderRadius: "999px",
  backgroundColor: "rgba(124, 58, 237, 0.1)",
  color: "#6d28d9",
  fontSize: "12px",
  fontWeight: 900,
  padding: "7px 9px",
  whiteSpace: "nowrap",
};

const jobFooterStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  color: "#64748b",
  fontSize: "13px",
};

export default function DashboardPage() {
  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        <section style={bannerStyle}>
          <div style={bannerContentStyle}>
            <div style={badgeStyle}>
              <Flame size={16} strokeWidth={2.4} />
              7 ngày luyện tập liên tiếp
            </div>
            <h1 style={bannerTitleStyle}>Chào mừng trở lại, Minh Anh.</h1>
            <p style={bannerTextStyle}>
              Hồ sơ của bạn đang ở mức Interview Ready. Hôm nay nên hoàn thành
              thêm một bài System Design và cập nhật phần thành tựu trong CV.
            </p>
            <div style={levelRowStyle}>
              <span style={levelPillStyle}>
                <Medal size={17} strokeWidth={2.4} />
                Level 6 Candidate
              </span>
              <span style={levelPillStyle}>
                <Target size={17} strokeWidth={2.4} />
                Mục tiêu: Senior Frontend
              </span>
            </div>
          </div>
          <div style={avatarWrapStyle}>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=360&q=85"
              alt="Avatar ứng viên"
              style={avatarStyle}
            />
          </div>
        </section>

        <section aria-label="Thống kê ứng viên" style={statsRowStyle}>
          {stats.map((stat) => (
            <article key={stat.label} style={statCardStyle}>
              <div style={statTopStyle}>
                <div>
                  <p style={statLabelStyle}>{stat.label}</p>
                  <p style={statValueStyle}>{stat.value}</p>
                </div>
                <div
                  style={{
                    ...statIconStyle,
                    backgroundColor: `${stat.accent}14`,
                    color: stat.accent,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
              <p style={helperStyle}>{stat.helper}</p>
            </article>
          ))}
        </section>

        <section style={contentGridStyle}>
          <article style={panelStyle}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Hoạt động gần đây</h2>
              <span style={panelActionStyle}>
                Xem tất cả
                <ChevronRight size={16} strokeWidth={2.4} />
              </span>
            </div>
            <div style={activityListStyle}>
              {recentActivities.map((activity) => (
                <div key={activity.title} style={activityItemStyle}>
                  <div style={timelineIconStyle}>
                    <CalendarCheck2 size={21} strokeWidth={2.3} />
                  </div>
                  <div>
                    <h3 style={activityTitleStyle}>{activity.title}</h3>
                    <p style={activityMetaStyle}>
                      {activity.date} · {activity.status}
                    </p>
                  </div>
                  <span style={scoreStyle}>{activity.score}</span>
                </div>
              ))}
            </div>
          </article>

          <aside style={panelStyle}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Việc làm phù hợp</h2>
              <ChartNoAxesColumnIncreasing size={22} color="#2563eb" />
            </div>
            <div style={jobListStyle}>
              {suggestedJobs.map((job) => (
                <article key={`${job.company}-${job.title}`} style={jobCardStyle}>
                  <div style={jobTopStyle}>
                    <div>
                      <h3 style={jobTitleStyle}>{job.title}</h3>
                      <p style={companyStyle}>{job.company}</p>
                    </div>
                    <span style={matchStyle}>{job.match}</span>
                  </div>
                  <div style={jobFooterStyle}>
                    <span>{job.location}</span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#2563eb",
                        fontWeight: 850,
                      }}
                    >
                      <BriefcaseBusiness size={15} strokeWidth={2.4} />
                      Chi tiết
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section
          style={{
            ...panelStyle,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          <div>
            <h2 style={panelTitleStyle}>Gợi ý tiếp theo</h2>
            <p style={helperStyle}>
              Tập trung vào cách lượng hóa thành tựu và luyện câu trả lời ngắn
              hơn trong 90 giây.
            </p>
          </div>
          <div style={activityItemStyle}>
            <div style={timelineIconStyle}>
              <Clock3 size={21} strokeWidth={2.3} />
            </div>
            <div>
              <h3 style={activityTitleStyle}>20 phút luyện phỏng vấn</h3>
              <p style={activityMetaStyle}>Khuyến nghị cho hôm nay</p>
            </div>
          </div>
          <div style={activityItemStyle}>
            <div style={timelineIconStyle}>
              <UserRound size={21} strokeWidth={2.3} />
            </div>
            <div>
              <h3 style={activityTitleStyle}>Cập nhật profile ứng viên</h3>
              <p style={activityMetaStyle}>Tăng độ phù hợp việc làm</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
