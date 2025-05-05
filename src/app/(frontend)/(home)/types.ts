import { Category } from '@/payload-types';

export type CustomCategory = Category & {
  subcategories: Category[]; // Adjust the type as needed
}; // Optional property to indicate if the category is active
