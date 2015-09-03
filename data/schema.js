import { GraphQLSchema } from 'graphql';
import { Root } from './queries';
import { Mutation } from './mutations';

export var GraphQLJupiterSchema = new GraphQLSchema({
	query: Root,
	mutation: Mutation
});














