import { RefObject } from 'react';

export const useDropdownPosition = (ref: RefObject<HTMLDivElement | null>) => {
  const getDropdownPosition = () => {
    if (!ref?.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // Set your dropdown width here

    // Ensure the dropdown doesn't go off the right side of the screen
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // Ensure the dropdown doesn't go off the bottom of the screen
    if (top + rect.height > window.innerHeight) {
      if (left + dropdownWidth > window.innerWidth) {
        left = rect.right - dropdownWidth + window.scrollX;
      }
      // Ensure the dropdown doesn't go off the right side of the screen
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
      // Ensure the dropdown doesn't go off the left side of the screen
      if (left < 0) {
        left = 16; // Adjust this value as needed
      }
    }
    return { top, left };
  };
  return { getDropdownPosition };
};
