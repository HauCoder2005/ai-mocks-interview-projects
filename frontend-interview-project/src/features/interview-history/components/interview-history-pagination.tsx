import { Pagination } from '@/components/common/pagination'; import type { ApiListMeta } from '@/lib/api/core/api-response';
export function InterviewHistoryPagination({meta,page,onChange}:{meta:ApiListMeta;page:number;onChange:(page:number)=>void}){return <Pagination itemCount={meta.itemCount} limit={meta.limit??10} onPageChange={onChange} page={meta.page??page} total={meta.total}/>}
