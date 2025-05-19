import React from "react";

import { Dropdown, Input } from "antd";

import type { FilterRule, MergedOptions } from "../../models/Notion";
type RuleEditorProps = {
  properties: MergedOptions;
  arrKey: string[];
  rule: FilterRule;
  onChange: (updated: FilterRule) => void;
};
const operatorOptions = [
  { label: "Is", value: "is" },
  { label: "Is not", value: "is_not" },
  { label: "Contains", value: "contains" },
  { label: "Does not contain", value: "not_contains" },
  { label: "Starts with", value: "starts_with" },
  { label: "Ends with", value: "ends_with" },
  { label: "Is empty", value: "is_empty" },
  { label: "Is not empty", value: "is_not_empty" },
];

function RuleEditor({ properties, rule, onChange, arrKey }: RuleEditorProps) {
  const handleOperatorValueChange = (value: string) => {
    onChange({ ...rule, operator: value as FilterRule["operator"] });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...rule, value: e.target.value });
  };

  const operatorMenuItems = operatorOptions.map((op) => ({
    key: op.value,
    label: op.label,
    onClick: () => handleOperatorValueChange(op.value),
  }));

  const fieldMenuItems = arrKey.map((key) => ({
    key,
    label: <div className="flex items-center gap-2">{key}</div>,
    onClick: () => onChange({ ...rule, field: key }),
  }));

  return (
    <div className="flex items-center gap-2 text-sm">
      <Dropdown menu={{ items: fieldMenuItems }} trigger={["click"]}>
        <button className="border px-3 py-1 rounded w-full flex items-center justify-between">
          <span className="flex items-center gap-2">{rule.field}</span>
          <span>▾</span>
        </button>
      </Dropdown>

      <Dropdown menu={{ items: operatorMenuItems }} trigger={["click"]}>
        <button className="border px-3 py-1 rounded w-full flex items-center justify-between">
          {operatorOptions.find((op) => op.value === rule.operator)?.label ||
            "Select"}
        </button>
      </Dropdown>

      {properties[rule.field]?.type === "select" ? (
        <Dropdown
          menu={{
            items:
              properties[rule.field]?.options?.map((option) => ({
                key: option,
                label: option,
                onClick: () =>
                  onChange({
                    ...rule,
                    value: option,
                  }),
              })) || [],
          }}
          trigger={["click"]}
        >
          <button className="border px-3 py-1 rounded w-full flex items-center justify-between">
            {rule.value || "Select value"}
            <span>▾</span>
          </button>
        </Dropdown>
      ) : (
        <Input
          type="text"
          value={rule.value}
          onChange={handleValueChange}
          placeholder="Value"
          className="border px-2 py-1 rounded w-full"
        />
      )}
    </div>
  );
}

export default RuleEditor;
