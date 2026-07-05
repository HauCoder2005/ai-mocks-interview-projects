import { AdminTopicGroups } from "../../topics/components/admin-topic-groups";
import { adminInterviewOptionGroupsMock } from "../data/admin-interview-options.mock";

export function AdminOptionGroupList() {
  return <AdminTopicGroups initialGroups={adminInterviewOptionGroupsMock} />;
}
