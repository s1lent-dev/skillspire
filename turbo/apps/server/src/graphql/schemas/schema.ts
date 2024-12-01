import { User } from "./user.schema.js";
import gql from "graphql-tag";

const typeDefs = gql`
    ${User}`;
export { typeDefs };