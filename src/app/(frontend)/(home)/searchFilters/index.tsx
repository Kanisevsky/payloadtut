'use client';
import { Categories } from './Categories';
import { SearchInput } from './SeachInput';
interface SearchFiltersProps {
  data: any; // Replace 'any' with the actual type of your data }
}

export const SearchFilters = ({ data }: SearchFiltersProps) => {
  console.log('SearchFilters data:', data);
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput disable={false} />
      <Categories data={data} />
    </div>
  );
};
