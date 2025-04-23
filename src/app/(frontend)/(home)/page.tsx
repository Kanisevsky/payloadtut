import React from 'react';
import configpromise from '@payload-config';
import { getPayload } from 'payload';

const Home = async () => {
  const payload = await getPayload({ config: configpromise });
  const data = await payload.find({
    collection: 'users',
  });

  return <div>{JSON.stringify(data, null)}</div>;
};

export default Home;
