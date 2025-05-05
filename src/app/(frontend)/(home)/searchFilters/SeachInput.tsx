'use client';
import { useState } from 'react';
import { ListFilterIcon, SearchIcon } from 'lucide-react';
import { Category } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CategoriesSidebar } from './CategoriesSidebar';

interface SearchInputProps {
  disable?: boolean;
  data: Category[];
}

export function SearchInput({ disable, data }: SearchInputProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        data={data}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 " />
        <Input
          className="pl-8"
          placeholder="Search Products"
          disabled={disable}
        />
      </div>
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon className="size-4" />
      </Button>
    </div>
  );
}
