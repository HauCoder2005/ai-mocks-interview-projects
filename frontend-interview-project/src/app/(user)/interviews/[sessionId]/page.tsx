import { InterviewHistoryDetailPage } from '@/features/interview-history';
export default async function Page({params}:{params:Promise<{sessionId:string}>}){const {sessionId}=await params;return <InterviewHistoryDetailPage sessionId={sessionId}/>}
