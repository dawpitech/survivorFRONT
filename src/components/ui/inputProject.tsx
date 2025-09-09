"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputProject({ name, value, onChange }: { name:string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="grid max-w-sm gap-3 p-[2rem]">
      <Label>{name}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        id={name}
        placeholder={name}
      />
    </div>
  );
}
