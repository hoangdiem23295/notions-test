import NotionList from "./components/notion-list";
import NotionMenu from "./components/notion-menu";
import type {
  FilterGroup,
  MergedOptions,
  NotionPage,
  RowData,
} from "./models/Notion";
import {
  generateProperties,
  getNumberFormatted,
  getRichText,
  getSelectColor,
  getSelectName,
  getTitle,
} from "./utils/notion/helper";
import { useEffect, useState } from "react";
import {
  fetchNotionData,
  filterNotionData,
  sortNotionData,
} from "./api/notion";

function App() {
  const [data, setData] = useState<RowData[]>([]);
  const [properties, setProperties] = useState<MergedOptions>({});

  const mapNotionPageToRow = (page: NotionPage): RowData => ({
    id: page.id,
    name: getTitle(page.properties.Name),
    contentSummary: getRichText(page.properties["Content Summary"]),
    status: getSelectName(page.properties.Status),
    statusColor: getSelectColor(page.properties.Status),
    priority: getSelectName(page.properties.Priority),
    priorityColor: getSelectColor(page.properties.Priority),
    estimatedValue: getNumberFormatted(page.properties["Estimated Value"]),
  });
  useEffect(() => {
    fetchNotionData().then((res) => {
      const properties = generateProperties(res.results);
      setProperties(properties);
      setData(res.results.map(mapNotionPageToRow));
    });
  }, []);

  const sortData = (
    property: string,
    direction: "ascending" | "descending"
  ) => {
    sortNotionData(property, direction).then((res) => {
      setData(res.results.map(mapNotionPageToRow));
    });
  };

  const handleFilterData = (
    filterGroup: FilterGroup,
    properties: MergedOptions
  ) => {
    filterNotionData(filterGroup, properties).then((res) => {
      setData(res.results.map(mapNotionPageToRow));
    });
  };

  return (
    <>
      <h1>Blog List</h1>
      <div className="card">
        <NotionMenu
          properties={properties}
          onSortChange={(property, direction) => {
            sortData(property, direction);
          }}
          onFilterChange={(filterGroup) => {
            handleFilterData(filterGroup, properties);
          }}
        ></NotionMenu>
        <NotionList data={data}></NotionList>
      </div>
    </>
  );
}

export default App;
