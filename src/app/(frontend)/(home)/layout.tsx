import configpromise from '@payload-config';
import { getPayload } from 'payload';

import { Navbar } from './navbar';
import { Footer } from './footer';
import { SearchFilters } from './searchFilters';
import { Category } from '@/payload-types';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const payload = await getPayload({ config: configpromise });
  const data = await payload.find({
    collection: 'categories',
    depth: 1,
    pagination: false,
    where: { parent: { exists: false } },
  });

  const formatedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs || []).map((doc) => ({
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));

  console.log('Layout data:', data);
  console.log('Formatted data:', formatedData);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formatedData} />
      <div className="flex-1 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
