import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { Slider } from "../ui/slider";
import { formatCurrency } from "@/app/utils/formatCurrency";

interface SalaryRangeSelectorProps {
  control: Control<any>;
  minSalary: number;
  maxSalary: number;
  step: number;
}

export function SalaryRangeSelector({
  control,
  maxSalary,
  minSalary,
  step,
}: SalaryRangeSelectorProps) {
  // Allows us to integrate external controlled component with react hook form.. control the form state from outside
  const { field: fromField } = useController({
    name: "salaryFrom",
    control,
  });

  const { field: toField } = useController({
    name: "salaryTo",
    control,
  });

  const [range, setRange] = useState<[number, number]>([
    fromField.value || minSalary,
    toField.value || maxSalary / 2,
  ]);

  const handleRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setRange(newRange);

    // Update the react hook form state to be use in submitting the form on the parent
    fromField.onChange(newRange[0]);
    toField.onChange(newRange[1]);
  };

  return (
    <div className="w-full space-y-4">
      <Slider
        onValueChange={handleRangeChange}
        min={minSalary}
        max={maxSalary}
        step={step}
        value={range}
      />

      <div className="flex justify-between">
        <span>{formatCurrency(range[0])}</span>
        <span>{formatCurrency(range[1])}</span>
      </div>
    </div>
  );
}

// 5hr 19mins // useController hook
