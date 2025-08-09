import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChangeEvent } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div 
      className="relative max-w-lg mx-auto mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search by coin name or symbol..."
        className="pl-10 pr-4"
      />
    </motion.div>
  );
}