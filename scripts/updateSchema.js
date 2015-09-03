#!/usr/bin/env babel-node --optional es7.asyncFunctions

import fs from 'fs';
import path from 'path';
import { GraphQLJupiterSchema } from '../data/schema';
import { graphql }  from 'graphql';
import { introspectionQuery } from 'graphql/utilities';

async () => {
  var result = await (graphql(GraphQLJupiterSchema, introspectionQuery));
  if (result.errors) {
    console.error(result.errors);
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../data/schema.json'),
      JSON.stringify(result, null, 2)
    );
  }
}();
