import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { resolvers } from "./resolvers/resolver.js";
import { typeDefs } from "./schemas/schema.js";


const graphqlServer = new ApolloServer({
    schema: buildSubgraphSchema([
        {
            typeDefs,
            resolvers
        }
    ]),
});
export { graphqlServer };
