import type {
  FilterGroup,
  FilterRule,
  MergedOptions,
  Page,
  PropertyValue,
} from "../../models/Notion";

export const getTitle = (value: PropertyValue | undefined): string => {
  if (value?.type === "title" && Array.isArray(value.title)) {
    return value.title[0]?.plain_text || "";
  }
  return "";
};

export const getRichText = (value: PropertyValue | undefined): string => {
  if (value?.type === "rich_text" && Array.isArray(value.rich_text)) {
    return value.rich_text[0]?.plain_text || "";
  }
  return "";
};

export const getSelectName = (value: PropertyValue | undefined): string => {
  if (value?.type === "select" && value.select) {
    return value.select.name;
  }
  return "";
};

export const getSelectColor = (value: PropertyValue | undefined): string => {
  if (value?.type === "select" && value.select) {
    return value.select.color;
  }
  return "default";
};

export const getNumberFormatted = (
  value: PropertyValue | undefined
): string => {
  if (value?.type === "number" && typeof value.number === "number") {
    return value.number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  return "";
};

export const mapNotionColor = (color: string) => {
  const map: Record<string, string> = {
    default: "#e0e0e0",
    pink: "#fcd3e1",
    red: "#f28b82",
    green: "#81c995",
    yellow: "#fdd663",
    blue: "#aecbfa",
    purple: "#d7aefb",
    brown: "#e6c9a8",
    orange: "#fbbc04",
    gray: "#e8eaed",
  };
  return map[color] || "#e0e0e0";
};

export function generateProperties(results: Page[]): MergedOptions {
  const mergedOptions: MergedOptions = {};

  results.forEach((page) => {
    for (const [propName, propValue] of Object.entries(page.properties)) {
      const type = propValue.type;

      if (!mergedOptions[propName]) {
        mergedOptions[propName] = { type, options: [] };
      }
      switch (type) {
        case "select": {
          const selectName = propValue.select?.name;
          if (
            selectName &&
            !mergedOptions[propName].options?.includes(selectName)
          ) {
            mergedOptions[propName].options?.push(selectName);
          }
          break;
        }

        case "multi_select":
          propValue.multi_select.forEach((item: { name: string }) => {
            if (
              item.name &&
              !mergedOptions[propName].options?.includes(item.name)
            ) {
              mergedOptions[propName].options?.push(item.name);
            }
          });
          break;

        case "people":
          propValue.people.forEach((person: { name: string }) => {
            if (
              person.name &&
              !mergedOptions[propName].options?.includes(person.name)
            ) {
              mergedOptions[propName].options?.push(person.name);
            }
          });
          break;

        case "title":
          propValue.title.forEach((text: { plain_text: string }) => {
            if (
              text.plain_text &&
              !mergedOptions[propName].options?.includes(text.plain_text)
            ) {
              mergedOptions[propName].options?.push(text.plain_text);
            }
          });
          break;

        case "rich_text":
          propValue.rich_text.forEach((text: { plain_text: string }) => {
            if (
              text.plain_text &&
              !mergedOptions[propName].options?.includes(text.plain_text)
            ) {
              mergedOptions[propName].options?.push(text.plain_text);
            }
          });
          break;

        case "number":
          if (propValue.number !== null) {
            const numStr = propValue.number.toString();
            if (!mergedOptions[propName].options?.includes(numStr)) {
              mergedOptions[propName].options?.push(numStr);
            }
          }
          break;

        default:
          break;
      }
    }
  });

  return mergedOptions;
}

export const buildNotionFilterGroup = (
  group: FilterGroup,
  properties: MergedOptions
) => {
  const filters = group.rules
    .map((rule) => buildNotionFilter(rule, properties))
    .filter((filter) => filter !== null);

  return {
    filter: {
      [group.condition]: filters,
    },
  };
};

export const buildNotionFilter = (
  rule: FilterRule,
  properties: MergedOptions
) => {
  const { field, value } = rule;
  const type = properties[field]?.type;

  if (!type) return null;

  switch (type) {
    case "select":
      return {
        property: field,
        select: {
          equals: value,
        },
      };
    case "checkbox":
      return {
        property: field,
        checkbox: {
          equals: value,
        },
      };
    case "rich_text":
      return {
        property: field,
        rich_text: {
          contains: value,
        },
      };
    default:
      return {
        property: field,
        [type]: {
          equals: value,
        },
      };
  }
};
