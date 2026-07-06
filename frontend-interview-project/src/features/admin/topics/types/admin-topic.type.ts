export type AdminTopicStatus = "Active" | "Inactive";

export type AdminTopicItem = {
  id: string;
  name: string;
  code: string;
  description: string;
  status: AdminTopicStatus;
};

export type AdminTopicGroup = {
  id: string;
  title: string;
  description: string;
  status: AdminTopicStatus;
  items: AdminTopicItem[];
};

export type AdminTopicFormInput = AdminTopicItem & {
  groupId: string;
};
