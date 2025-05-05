'use client';
import React, { useEffect, useState } from 'react';
import { Category } from '@/payload-types';
import { ListFilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryDropDown } from './CategoryDropDown';
import { CategoriesSidebar } from './CategoriesSidebar';
import { cn } from '@/lib/utils';

interface CategoriesProps {
  data: Category[];
}

export function Categories({ data }: CategoriesProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const viewAllRef = React.useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = 'Business & Money'; // Placeholder for the active category
  const activeCategoryIndex = data.findIndex(
    (category) => category.name === activeCategory
  );
  const isActiveCategoryHiden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisibleCount = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;
      for (const item of items) {
        const itemWidth = item.getBoundingClientRect().width;
        if (totalWidth + itemWidth > availableWidth) break;
        totalWidth += itemWidth;
        visible++;
      }
      setVisibleCount(visible);
    };
    let resizeObserver: ResizeObserver | null = null;

    if (containerRef.current) {
      resizeObserver = new ResizeObserver(calculateVisibleCount);
      resizeObserver.observe(containerRef.current!);
      calculateVisibleCount(); // Initial calculation
    }
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [data.length]);
  return (
    <div className="relative w-full">
      {/* Sidebar */}
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        data={data}
      />

      {/* Hidden Items for Measurement */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: 'fixed', top: -9999, left: -9999 }}
      >
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropDown
              category={category}
              isActive={activeCategory === category.name}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
      {/* Visible Items */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
        className="flex flex-nowrap items-center"
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropDown
              category={category}
              isActive={activeCategory === category.name}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
        <div ref={viewAllRef} className="shrink-0 ">
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              'h-11 px-4 bg-transparent border border-transparent rounded-full text-black hover:bg-white hover:border-primary',
              isActiveCategoryHiden &&
                !isAnyHovered &&
                'bg-white border-primary'
            )}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
