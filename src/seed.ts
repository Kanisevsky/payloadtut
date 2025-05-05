import { getPayload } from 'payload';
import config from './payload.config';
const categories = [
  {
    name: 'Business & Money',
    color: '#FFB347',
    slug: 'business-money',
    subcategories: [
      { name: 'Accounting', slug: 'accounting' },
      {
        name: 'Entrepreneurship',
        slug: 'entrepreneurship',
      },
      { name: 'Gigs & Side Projects', slug: 'gigs-side-projects' },
      { name: 'Investing', slug: 'investing' },
      { name: 'Management & Leadership', slug: 'management-leadership' },
      {
        name: 'Marketing & Sales',
        slug: 'marketing-sales',
      },
      { name: 'Networking, Careers & Jobs', slug: 'networking-careers-jobs' },
      { name: 'Personal Finance', slug: 'personal-finance' },
      { name: 'Real Estate', slug: 'real-estate' },
    ],
  },
  {
    name: 'Software Development',
    color: '#7EC8E3',
    slug: 'software-development',
    subcategories: [
      { name: 'Web Development', slug: 'web-development' },
      { name: 'Mobile Development', slug: 'mobile-development' },
      { name: 'Game Development', slug: 'game-development' },
      { name: 'Programming Languages', slug: 'programming-languages' },
      { name: 'DevOps', slug: 'devops' },
    ],
  },
  {
    name: 'Writing & Publishing',
    color: '#D8B5FF',
    slug: 'writing-publishing',
    subcategories: [
      { name: 'Fiction', slug: 'fiction' },
      { name: 'Non-Fiction', slug: 'non-fiction' },
      { name: 'Blogging', slug: 'blogging' },
      { name: 'Copywriting', slug: 'copywriting' },
      { name: 'Self-Publishing', slug: 'self-publishing' },
    ],
  },
  {
    name: 'Other',
    slug: 'other',
  },
  {
    name: 'Education',
    color: '#FFE066',
    slug: 'education',
    subcategories: [
      { name: 'Online Courses', slug: 'online-courses' },
      { name: 'Tutoring', slug: 'tutoring' },
      { name: 'Test Preparation', slug: 'test-preparation' },
      { name: 'Language Learning', slug: 'language-learning' },
    ],
  },
  {
    name: 'Self Improvement',
    color: '#96E6B3',
    slug: 'self-improvement',
    subcategories: [
      { name: 'Productivity', slug: 'productivity' },
      { name: 'Personal Development', slug: 'personal-development' },
      { name: 'Mindfulness', slug: 'mindfulness' },
      { name: 'Career Growth', slug: 'career-growth' },
    ],
  },
  {
    name: 'Fitness & Health',
    color: '#FF9AA2',
    slug: 'fitness-health',
    subcategories: [
      { name: 'Workout Plans', slug: 'workout-plans' },
      { name: 'Nutrition', slug: 'nutrition' },
      { name: 'Mental Health', slug: 'mental-health' },
      { name: 'Yoga', slug: 'yoga' },
    ],
  },
  {
    name: 'Design',
    color: '#B5B9FF',
    slug: 'design',
    subcategories: [
      { name: 'UI/UX', slug: 'ui-ux' },
      { name: 'Graphic Design', slug: 'graphic-design' },
      { name: '3D Modeling', slug: '3d-modeling' },
      { name: 'Typography', slug: 'typography' },
    ],
  },
  {
    name: 'Drawing & Painting',
    color: '#FFCAB0',
    slug: 'drawing-painting',
    subcategories: [
      { name: 'Watercolor', slug: 'watercolor' },
      { name: 'Acrylic', slug: 'acrylic' },
      { name: 'Oil', slug: 'oil' },
      { name: 'Pastel', slug: 'pastel' },
      { name: 'Charcoal', slug: 'charcoal' },
    ],
  },
  {
    name: 'Music',
    color: '#FFD700',
    slug: 'music',
    subcategories: [
      { name: 'Songwriting', slug: 'songwriting' },
      { name: 'Music Production', slug: 'music-production' },
      { name: 'Music Theory', slug: 'music-theory' },
      { name: 'Music History', slug: 'music-history' },
    ],
  },
  {
    name: 'Photography',
    color: '#FF6B6B',
    slug: 'photography',
    subcategories: [
      { name: 'Portrait', slug: 'portrait' },
      { name: 'Landscape', slug: 'landscape' },
      { name: 'Street Photography', slug: 'street-photography' },
      { name: 'Nature', slug: 'nature' },
      { name: 'Macro', slug: 'macro' },
    ],
  },
];

// Helper function to retry operations
const retry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if it's a write conflict error (code 112)
      const isWriteConflict =
        error &&
        error.response &&
        error.response.data &&
        error.response.data.errors &&
        error.response.data.errors[0] &&
        error.response.data.errors[0].code === 112;

      // If it's not a WriteConflict or we're out of retries, throw the error
      if (!isWriteConflict || attempt === maxRetries) {
        throw error;
      }

      console.log(
        `Encountered write conflict. Retrying (${attempt}/${maxRetries})...`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

const seed = async () => {
  const payload = await getPayload({ config });

  console.log('Starting to seed categories...');

  // Clear existing categories with retries
  try {
    console.log('Attempting to clear existing categories...');

    const allCategories = await retry(() =>
      payload.find({
        collection: 'categories',
        limit: 1000,
      })
    );

    if (allCategories.docs.length > 0) {
      console.log(
        `Found ${allCategories.docs.length} existing categories. Deleting...`
      );

      // Delete categories one by one with retries
      for (const category of allCategories.docs) {
        await retry(() =>
          payload.delete({
            collection: 'categories',
            id: category.id,
          })
        );
      }

      console.log(`Cleared ${allCategories.docs.length} existing categories.`);
    } else {
      console.log('No existing categories found. Starting fresh.');
    }
  } catch (error) {
    console.error('Error clearing categories:', error.message);
  }

  // Now create all categories
  console.log('Creating categories...');
  let parentCategoriesCreated = 0;
  let subcategoriesCreated = 0;

  for (const category of categories) {
    try {
      console.log(`Creating category: ${category.name}`);

      // Handle optional properties
      const categoryData = {
        name: category.name,
        slug: category.slug,
        parent: null,
      };

      // Create parent category with retry
      const parentCategory = await retry(() =>
        payload.create({
          collection: 'categories',
          data: categoryData,
        })
      );

      parentCategoriesCreated++;

      // Process subcategories if they exist
      if (
        category.subcategories &&
        Array.isArray(category.subcategories) &&
        category.subcategories.length > 0
      ) {
        for (const subcategory of category.subcategories) {
          console.log(`  Creating subcategory: ${subcategory.name}`);

          const subcategoryData = {
            name: subcategory.name,
            slug: subcategory.slug,
            parent: parentCategory.id,
          };

          // Create subcategory with retry
          await retry(() =>
            payload.create({
              collection: 'categories',
              data: subcategoryData,
            })
          );

          subcategoriesCreated++;
        }
      } else {
        console.log(`  No subcategories for: ${category.name}`);
      }
    } catch (error: any) {
      console.error(
        `Error processing category ${category.name}:`,
        error.message
      );
      // Log full error for debugging
      if (error.response && error.response.data) {
        console.error(
          'Error details:',
          JSON.stringify(error.response.data, null, 2)
        );
      }
    }
  }

  console.log(`Category seeding complete!`);
  console.log(
    `Created ${parentCategoriesCreated} parent categories and ${subcategoriesCreated} subcategories.`
  );
  console.log(
    `Total categories created: ${parentCategoriesCreated + subcategoriesCreated}`
  );
};

// Add a little delay before starting to allow MongoDB to initialize properly
setTimeout(async () => {
  console.log('Starting seed process...');
  try {
    await seed();
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed process failed:', error);
    process.exit(1);
  }
}, 2000);
