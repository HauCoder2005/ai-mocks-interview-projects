"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/common/pagination";
import { appRoutes } from "@/lib/constants/app-routes";
import { useMockTests } from "../hooks";
import { MockTestEmptyState } from "./mock-test-empty-state";
import { MockTestErrorState } from "./mock-test-error-state";
import { MockTestList } from "./mock-test-list";
import { MockTestLoading } from "./mock-test-loading";
import styles from "./mock-tests.module.css";

export function MockTestListPage() {
  const router = useRouter();
  const { data, meta, loading, error, refetch, page, setPage, keyword, setKeyword } = useMockTests();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Bài kiểm tra trắc nghiệm</p>
          <h1 className={styles.title}>Luyện nhanh kiến thức backend</h1>
          <p className={styles.text}>Chọn một bài kiểm tra đã được công bố để bắt đầu.</p>
        </header>
        <section className={styles.filterBar}>
          <label className={styles.searchField}><Search size={18} /><input onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm bài kiểm tra..." type="search" value={keyword} /></label>
        </section>
        {loading ? <MockTestLoading /> : null}
        {!loading && error ? <MockTestErrorState message={error} onRetry={refetch} /> : null}
        {!loading && !error && !data.length ? <MockTestEmptyState /> : null}
        {!loading && !error && data.length ? <MockTestList items={data} onStart={(id) => router.push(appRoutes.mockTestDetail(id))} /> : null}
        {!loading && meta?.total ? <Pagination itemCount={meta.itemCount} limit={meta.limit ?? 9} onPageChange={setPage} page={meta.page ?? page} total={meta.total} /> : null}
      </div>
    </main>
  );
}
