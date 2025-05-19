import type { FilterGroup, MergedOptions } from "../models/Notion";
import { buildNotionFilterGroup } from "../utils/notion/helper";

export async function fetchNotionData() {
  const res = await fetch("http://localhost:3001/api/notion");
  const data = await res.json();
  return data;
}

export async function sortNotionData(
  property: string,
  direction: "ascending" | "descending"
) {
  const res = await fetch("http://localhost:3001/api/notion/sorted", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sorts: [
        {
          property,
          direction,
        },
      ],
    }),
  });
  const data = await res.json();
  return data;
}

export async function filterNotionData(
  group: FilterGroup,
  properties: MergedOptions
) {
  const notionFilter = buildNotionFilterGroup(group, properties);

  const res = await fetch("http://localhost:3001/api/notion/filtered", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notionFilter),
  });

  const data = await res.json();

  return data;
}
