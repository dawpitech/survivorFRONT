"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputProject({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="grid w-full max-w-sm justify-end gap-3 p-[2rem]">
      <Label>Project Name</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        id="projectName"
        placeholder="Project 1"
      />
    </div>
  );
}
