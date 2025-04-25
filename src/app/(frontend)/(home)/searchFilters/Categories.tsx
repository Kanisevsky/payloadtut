import React from 'react';
import { Category } from '@/payload-types';
import { CategoryDropDown } from './CategoryDropDown';

interface CategoriesProps {
  data: Category[];
}

export function Categories({ data }: CategoriesProps) {
  return (
    <div className="relative w-full ">
      <div className="flex flex-nowrap items-center">
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropDown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
