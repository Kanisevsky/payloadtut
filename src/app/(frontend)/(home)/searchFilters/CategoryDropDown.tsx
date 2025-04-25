'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Category } from '@/payload-types';
import { useDropdownPosition } from './useDropdownPosition';
import { SubcategoryMenu } from './SubcategoryMenu';

interface CategoryDropDownProps {
  category: Category; // Replace 'any' with the actual type of your category data
  isActive?: boolean;
  isNavigationHovered?: boolean; // Replace 'boolean' with the actual type if needed
}

export function CategoryDropDown({
  category,
  isActive,
  isNavigationHovered,
}: CategoryDropDownProps) {
  // You can use the category, isActive, and isNavigationHovered props here
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);
  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };

  const dropDownPosition = getDropdownPosition() || { top: 0, left: 0 };
  console.log(dropDownPosition, 'dropdown position');
  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          variant="elevated"
          className={cn(
            'h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black',
            isActive && !isNavigationHovered && 'bg-white border-primary'
          )}
        >
          {category.name}
        </Button>
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropDownPosition}
      />
    </div>
  );
}
