import { User } from "../../models/user.model.js";

const resolvers = {
    typeDefs: {},
    Query: {
        getUser: async (userId: any) => {
            return {
                userId: "1",
                googleId: "1",
                githubId: "1",
                firstName: "John",
                lastName: "Doe",
                displayName: "John Doe",
                userName: "johndoe",
                email: "johndoe@gmail.com",
                password: "password",
                avatar: "avatar",
                bio: "bio",
            }
        }
    },
    Mutation: {
        register: async(parent: any, { registerInput }: { registerInput: any }, context: any, info: any) => {
            try {
                console.log(parent, context, info, registerInput);
                const user = await User.create(registerInput);
                return user;
            } catch (err) {
                console.error(err);
            }
        }
    }
};
export { resolvers };
