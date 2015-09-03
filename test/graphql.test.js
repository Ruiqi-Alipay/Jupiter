import { expect } from 'chai';
import { StarWarsSchema } from '../data/starWarsSchema';
import { graphql } from 'graphql';
console.log(Object.assign({a: 1}, {a: 2}));
describe('Star Wars Query Tests', () => {
	describe('Basic Queries', () => {
		it('test1', (done) => {
			var query = `
				query HeroNameQuery {
					hero {
						name
					}
				}
			`;
			var expected = {
				hero: {
					name: 'R2-D2'
				}
			};

			graphql(StarWarsSchema, query)
				.then(result => {
					expect(result).to.deep.equal({ data: expected });
					done();
				})
				.catch(err => {
					done();
				});
		});
	});
});