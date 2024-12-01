import gql from "graphql-tag";

const User = gql`

# Enums
enum Gender {
    MALE
    FEMALE
}
enum Role {
    USER
    RECRUITER
}


# Scalars
scalar Date



# Interfaces 



# Objects and Interfaces

#Social
interface SocialInterface {
    twitter: String
    linkedin: String
    github: String
    leetcode: String
}
type Social implements SocialInterface {
    twitter: String
    linkedin: String
    github: String
    leetcode: String
}


#Education
interface EducationInterface {
    qualification: String
    degree: String
    stream: String
    institute: String
    cgpa: Float
    start: Date
    end: Date
}
type Education implements EducationInterface {
    qualification: String
    degree: String
    stream: String
    institute: String
    cgpa: Float
    start: Date
    end: Date
}


#Experience
interface ExperienceInterface {
    title: String
    company: String
    location: String
    start: Date
    end: Date
    current: Boolean
    description: String
}
type Experience implements ExperienceInterface {
    title: String
    company: String
    location: String
    start: Date
    end: Date
    current: Boolean
    description: String
}


#Profile
interface ProfileInterface {
    bio: String
    skills: [String!]
    social: Social
    education: [Education!]
    experience: [Experience!]
}
type Profile implements ProfileInterface {
    bio: String
    skills: [String!]
    social: Social
    education: [Education!]
    experience: [Experience!]
}


#User
interface UserInterface {
    userId: ID!
    googleId: ID
    githubId: ID
    firstName: String
    lastName: String
    displayName: String
    username: String!
    email: String!
    password: String!
    avatar: String
    bio: String
    gender: Gender
    dob: Date
    phone: String
    address: String
    location: String
    role: Role
    profile: Profile
    company: ID
    appliedJobs: [ID!]
    savedJobs: [ID!]
    createdAt: Date
    updatedAt: Date
}
type User implements UserInterface {
    userId: ID!
    googleId: ID
    githubId: ID
    firstName: String
    lastName: String
    displayName: String
    username: String!
    email: String!
    password: String!
    avatar: String
    bio: String
    gender: Gender
    dob: Date
    phone: String
    address: String
    location: String
    role: Role
    profile: Profile
    company: ID
    appliedJobs: [ID!]
    savedJobs: [ID!]
    createdAt: Date
    updatedAt: Date
}


# Queries
type Query {
    getMe(userId: ID!): User
    getUser: User
}

input RegisterInput {
    firstName: String!
    lastName: String!
    displayName: String!
    username: String!
    email: String!
    password: String!
    role: Role!
}

type Mutation {
    register(registerInput: RegisterInput): User
}
`

export { User }