import { Category } from '@/payload-types';
import Link from 'next/link';

interface SubcategoryMenuProps {
  category: Category; // Replace 'any' with the actual type of your category data
  isOpen: boolean;
  position: { top: number; left: number };
}

export function SubcategoryMenu({
  category,
  isOpen,
  position,
}: SubcategoryMenuProps) {
  if (!isOpen || (category.subcategories && category.subcategories.lenght > 0))
    return null;

  const backgroundColor = category.color || '#F5f5f5'; // Replace with your desired background color=

  return (
    <div
      className=" fixed z-50"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {/* Invisible Bridge between dropdown and button */}
      <div className="h-3 w-60" />
      <div
        style={{ backgroundColor }}
        className="w-60 text-black rounded-md border shadow-[4px_0_0_rgba(0,0,0,0.1)] 
      -translate-x-[2px] -translate-y-[2px]"
      >
        <div className="">
          {category.subcategories?.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              href=""
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
