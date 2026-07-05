import styles from "./admin-placeholder-page.module.css";

type AdminPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AdminPlaceholderPage({
  description,
  title,
}: AdminPlaceholderPageProps) {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Admin</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <div className={styles.panel}>
        Noi dung chi tiet se duoc noi lai voi API/admin components khi can.
      </div>
    </section>
  );
}
