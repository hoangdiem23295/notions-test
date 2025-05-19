import { IoFilterOutline } from "react-icons/io5";
import { BiSort } from "react-icons/bi";
import { FaTableList } from "react-icons/fa6";
import {
  initialGroup,
  type FilterGroup,
  type MergedOptions,
} from "../../models/Notion";
import type { MenuProps } from "antd";
import { Drawer, Dropdown } from "antd";
import { useState } from "react";
import FilterBuilder from "../notion-filter";

type IndexProps = {
  properties: MergedOptions;
  onSortChange: (
    property: string,
    direction: "ascending" | "descending"
  ) => void;
  onFilterChange: (filter: FilterGroup) => void;
};

function Index({ properties, onSortChange, onFilterChange }: IndexProps) {
  const [sortProperty, setSortProperty] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<
    "ascending" | "descending"
  >("ascending");
  const [openFilter, setOpenFilter] = useState(false);

  const [filterGroup, setFilterGroup] = useState<FilterGroup>(initialGroup);

  const arrKey: string[] = Object.keys(properties);

  const handleSortClick = (property: string) => {
    let nextDirection: "ascending" | "descending" = "ascending";

    if (property === sortProperty) {
      nextDirection =
        sortDirection === "ascending" ? "descending" : "ascending";
    }

    setSortProperty(property);
    setSortDirection(nextDirection);
    onSortChange(property, nextDirection);
  };

  const items: MenuProps["items"] = arrKey.map((key: string) => ({
    label: key,
    key: key,
    onClick: () => handleSortClick(key),
  }));

  const handleFilter = (filter: FilterGroup) => {
    onFilterChange(filter);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <FaTableList /> All Record
      </div>
      <div className="flex w-[200px]">
        <button
          className="px-2 mr-8 py-1 hover:bg-gray-300 rounded"
          onClick={() => setOpenFilter(true)}
        >
          <IoFilterOutline /> Filter
        </button>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <button className="px-2 mr-8 py-1 hover:bg-gray-300 rounded">
            <BiSort /> Sort
          </button>
        </Dropdown>
      </div>
      <Drawer
        title="Filter Records"
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        width={560}
      >
        <FilterBuilder
          properties={properties}
          arrKey={arrKey}
          group={filterGroup}
          onChange={setFilterGroup}
          isRoot={true}
        />
        <div className="mt-4">
          <button
            onClick={() => {
              handleFilter(filterGroup);
              setOpenFilter(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Filters
          </button>
        </div>
      </Drawer>
    </div>
  );
}

export default Index;
