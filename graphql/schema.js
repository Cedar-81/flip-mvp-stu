import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Query {
    student(studentId: ID!): Student
    studentteachercourse(studentId: ID!): [Student_Teacher_Course]!
    personal_notes(studentId: ID!): [Student_Note]!
    personal_note(id: ID!): Student_Note
    notes(
      authorId: ID!
      courseId: ID!
      classId: ID!
      noteType: String!
    ): [Teacher_Note]!
    note(id: ID!): Teacher_Note
  }

  type Mutation {
    addStudentNote(input: addStudentNoteInput): Student_Note!
    updateStudentNote(input: updateStudentNoteInput): Student_Note!
    updateStudentProfile(input: updateStudentProfileInput): Student!
    deleteStudentNote(input: deleteStudentNoteInput): String
  }

  type Teacher_Note {
    id: String!
    topic: String
    classId: [String!]!
    courseId: String!
    category: String
    content: String
    editableContent: String
    authorId: String
    updatedAt: String
  }

  type Student {
    id: String!
    firstName: String
    lastName: String
    address: String
    state: String
    country: String
    postalCode: String
    email: String
    image: String
    dateOfBirth: String
    phoneNo: String
    class: String
    updatedAt: String
    password: String
  }

  type Student_Teacher_Course {
    id: String!
    studentId: String
    classId: String
    teacher: Teacher
    teacherId: String
    courseList: [Course]
    verified: Boolean
  }

  type Course {
    id: String!
    course: String
  }

  type Student_Note {
    id: String!
    topic: String
    category: String
    content: String
    editableContent: String
    authorId: String
    updatedAt: String
  }

  type Teacher {
    id: String!
    firstName: String
    lastName: String
    address: String
    state: String
    country: String
    postalCode: String
    email: String
    image: String
    phoneNo: String
    updatedAt: String
    password: String
  }

  input updateStudentProfileInput {
    id: String!
    firstName: String
    lastName: String
    address: String
    state: String
    country: String
    postalCode: String
    email: String
    image: String
    dateOfBirth: String
    phoneNo: String
    class: String
    updatedAt: String
    password: String
  }

  input addStudentNoteInput {
    topic: String
    category: String
    content: String
    editableContent: String
    authorId: String
    updatedAt: String
  }

  input deleteStudentNoteInput {
    id: String!
  }

  input updateStudentNoteInput {
    id: String!
    topic: String
    category: String
    content: String
    editableContent: String
    authorId: String
    updatedAt: String
  }
`;
