"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputProject({ name, value, onChange }: { name:string, value: string, onChange: (val: string) => void }) {
  return (
    <div className="grid p-[2rem] items-center">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        id={name}
        placeholder={name}
        className="bg-white"
      />
    </div>
  );
}
