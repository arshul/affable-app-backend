const express = require('express');
const { HttpLink } = require('apollo-link-http');
const { introspectSchema, makeRemoteExecutableSchema } = require('graphql-tools');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const { ApolloServer, gql } = require('apollo-server-express');
const fetch = require('node-fetch')
const { createApolloFetch } = require('apollo-fetch');

// const fetcher = createApolloFetch({ uri: 'https://api.graph.cool/simple/v1/cjsr59a4t1a2l0135oyxt8how'});
const UserDataLink = new HttpLink({
    uri: "https://api.graph.cool/simple/v1/cjsr59a4t1a2l0135oyxt8how",
    fetch,
});
async function makeSchema() {
    const result = await fetch("https://api.graph.cool/simple/v1/cjsr59a4t1a2l0135oyxt8how",  {
        method: 'POST', 
        headers: {accept: '*/*', 'content-type': 'application/json'},
        body: JSON.stringify({query: '{ allInfluencers { id }}'})}
      );
    console.log((await result.text()))
    const executableSchema = makeRemoteExecutableSchema({
        schema:await introspectSchema(UserDataLink),
        link:UserDataLink,
    });

    return executableSchema
}



makeSchema().then(schema => {
    console.log(schema)
    const server = new ApolloServer({
        schema
    });
    const app = express();
    app.use(cors());
    server.applyMiddleware({ app })
    app.listen(4000, () => {
        console.log(`Go to http://localhost:4000/graphql to run queries!`);
    });
}).catch(err => {
    console.log(err);
})
