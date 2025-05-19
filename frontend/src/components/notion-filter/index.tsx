import { useEffect } from "react";
import { Button, Dropdown, Select } from "antd";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import RuleEditor from "./RuleEditor";
import type {
  FilterGroup,
  FilterRule,
  MergedOptions,
} from "../../models/Notion";

const { Option } = Select;

type FilterBuilderProps = {
  properties: MergedOptions;
  arrKey: string[];
  group: FilterGroup;
  onChange: (updatedGroup: FilterGroup) => void;
  depth?: number;
  isRoot?: boolean;
};

export default function FilterBuilder({
  properties,
  arrKey,
  group,
  onChange,
  depth = 0,
  isRoot = false,
}: FilterBuilderProps) {
  useEffect(() => {
    if (isRoot && group.rules.length === 0) {
      onChange({
        ...group,
        rules: [{ field: "", operator: "contains", value: "" }],
      });
    }
  }, [group, isRoot, onChange]);

  const updateRule = (index: number, updated: FilterRule | FilterGroup) => {
    const newRules = [...group.rules];
    newRules[index] = updated;
    onChange({ ...group, rules: newRules });
  };

  const deleteRule = (index: number) => {
    const newRules = group.rules.filter((_, i) => i !== index);
    onChange({ ...group, rules: newRules });
  };

  const duplicateRule = (index: number) => {
    const ruleToClone = group.rules[index];
    const cloned = JSON.parse(JSON.stringify(ruleToClone));
    const newRules = [...group.rules];
    newRules.splice(index + 1, 0, cloned);
    onChange({ ...group, rules: newRules });
  };

  const handleConditionChange = (value: string) => {
    onChange({ ...group, condition: value as "and" | "or" });
  };

  const addMenu = {
    items: [
      {
        key: "add-rule",
        label: "Add filter rule",
        onClick: () =>
          onChange({
            ...group,
            rules: [
              ...group.rules,
              { field: "", operator: "contains", value: "" },
            ],
          }),
      },
      ...(depth < 2
        ? [
            {
              key: "add-group",
              label: "Add filter group",
              onClick: () =>
                onChange({
                  ...group,
                  rules: [
                    ...group.rules,
                    {
                      type: "group",
                      condition: "and",
                      rules: [{ field: "", operator: "contains", value: "" }],
                    },
                  ],
                }),
            },
          ]
        : []),
    ],
  };
  const itemMenu = (index: number) => ({
    items: [
      {
        key: "remove",
        label: "Remove",
        danger: true,
        onClick: () => deleteRule(index),
      },
      {
        key: "duplicate",
        label: "Duplicate",
        onClick: () => duplicateRule(index),
      },
    ],
  });

  return (
    <div
      className={`border border-gray-200 rounded-xl p-4 mb-4 bg-white shadow-sm ml-${
        depth * 4
      }`}
    >
      <div className="space-y-2">
        {group.rules.map((rule, index) => {
          const isFirst = index === 0;
          const shouldShowDropdown = isFirst;
          return (
            <div key={index} className="flex items-start gap-2">
              {!isFirst && (
                <div className="w-10 flex justify-end pt-2 text-gray-500 font-semibold">
                  {group.condition.toUpperCase()}
                </div>
              )}

              <div className="flex flex-grow">
                {shouldShowDropdown && (
                  <div className="flex items-center gap-2 mb-2">
                    <Select
                      value={group.condition}
                      onChange={handleConditionChange}
                      size="small"
                    >
                      <Option value="and">AND</Option>
                      <Option value="or">OR</Option>
                    </Select>
                  </div>
                )}

                {"type" in rule ? (
                  <FilterBuilder
                    properties={properties}
                    arrKey={arrKey}
                    group={rule}
                    onChange={(updated) => updateRule(index, updated)}
                    depth={depth + 1}
                    isRoot={false}
                  />
                ) : (
                  <RuleEditor
                    properties={properties}
                    arrKey={arrKey}
                    rule={rule}
                    onChange={(updated) => updateRule(index, updated)}
                  />
                )}
              </div>

              <Dropdown menu={itemMenu(index)} trigger={["click"]}>
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <Dropdown menu={addMenu} trigger={["click"]}>
          <Button icon={<PlusOutlined />} size="small" type="link">
            Add filter rule
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
