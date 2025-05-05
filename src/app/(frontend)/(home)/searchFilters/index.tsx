'use client';
import { CustomCategory } from '../types';
import { Categories } from './Categories';
import { SearchInput } from './SeachInput';
interface SearchFiltersProps {
  data: CustomCategory[]; // Replace 'any' with the actual type of your data }
}

export const SearchFilters = ({ data }: SearchFiltersProps) => {
  console.log('SearchFilters data:', data);
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput disable={false} data={data} />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
    </div>
  );
};
