import { SelectProps } from "antd";
import { SegmentedLabeledOption, SegmentedOptions } from "antd/es/segmented";

export const documentOptions: SelectProps['options'] = [
  {value: "land use right certificate", label: "Land use right certificate"},
  {value: "sale contract", label: "Sale contract"},
  {value: "waiting for certificate", label: "Waiting for certificate"},
];

export const furnitureOptions: SelectProps['options'] = [
  {value: "full", label: "Full"},
  {value: "simple", label: "Simple"},
  {value: "no furniture", label: "No furniture"},
];

export const directionOptions: SelectProps['options'] = [
  {value: "north", label: "North"},
  {value: "east", label: "East"},
  {value: "south", label: "South"},
  {value: "west", label: "West"},
  {value: "northeast", label: "Northeast"},
  {value: "southeast", label: "Southeast"},
  {value: "northwest", label: "Northwest"},
  {value: "southwest", label: "Southwest"},
];

export const listingTypeOptions: SegmentedOptions<string | number | SegmentedLabeledOption<string | number>> = [
  { value: 'forSale', label: 'For sale' }, 
  { value: 'forRent', label: 'For rent' }
];