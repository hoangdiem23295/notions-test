export type RowData = {
  id: string;
  name: string;
  contentSummary: string;
  status: string;
  statusColor: string;
  priority: string;
  priorityColor: string;
  estimatedValue: string;
};
export type SelectOption = {
  id: string;
  name: string;
  color: string;
};

export type MultiSelectOption = SelectOption;

export type Person = {
  object: "user";
  id: string;
  name: string;
  avatar_url: string | null;
  type: string;
  person: {
    email: string;
  };
};

export type PropertyValue =
  | {
      type: "select";
      select: SelectOption | null;
    }
  | {
      type: "multi_select";
      multi_select: MultiSelectOption[];
    }
  | {
      type: "people";
      people: Person[];
    }
  | {
      type: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  | {
      type: "title";
      title: { plain_text: string }[];
    }
  | {
      type: "rich_text";
      rich_text: { plain_text: string }[];
    }
  | {
      type: "number";
      number: number | null;
    };

export type NotionPage = {
  id: string;
  properties: Record<string, PropertyValue>;
};

export type Page = {
  id: string;
  properties: {
    [key: string]: PropertyValue;
  };
};

export type MergedOptions = {
  [property: string]: {
    type: string;
    options?: string[];
  };
};

export type FilterRule = {
  field: string;
  operator:
    | "is"
    | "is_not"
    | "contains"
    | "not_contains"
    | "starts_with"
    | "ends_with"
    | "is_empty"
    | "is_not_empty";
  value: string;
};

export type FilterGroup = {
  type: "group";
  condition: "and" | "or";
  rules: Array<FilterRule | FilterGroup>;
};

export const initialGroup: FilterGroup = {
  type: "group",
  condition: "and",
  rules: [],
};
