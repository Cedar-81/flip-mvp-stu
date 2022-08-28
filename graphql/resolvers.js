import { sign } from "jsonwebtoken";
const bcrypt = require("bcryptjs");
import Cookies from "cookies";
import isAuth from "./isAuth";
import sendEmail from "./sendEmail";

export const resolvers = {
  Query: {
    studentteachercourse: async (parent, args, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const value = await context.prisma.student_Teacher_Course.findMany({
          where: {
            studentId: payload.studentId,
            verified: true,
          },
          include: {
            teacher: true,
            courseList: true,
            class: true,
          },
        });
        return value;
      } else {
        return "unauthorized";
      }
    },

    student: async (parent, args, context) => {
      const { verified, payload } = isAuth(context.req);
      console.log("student", payload.studentId);
      if (verified) {
        return await context.prisma.student.findUnique({
          where: {
            id: payload.studentId,
          },
        });
      } else {
        return "unauthorized";
      }
    },

    personal_notes: async (parent, args, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        return await context.prisma.student_Note.findMany({
          where: {
            authorId: payload.studentId,
          },
        });
      } else {
        return "unauthorized";
      }
    },

    personal_note: async (parent, args, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        return await context.prisma.student_Note.findUnique({
          where: {
            id: args.id,
          },
        });
      } else {
        return "unauthorized";
      }
    },

    notes: async (parent, args, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const value = await context.prisma.teacher_Note.findMany({
          where: {
            authorId: args.teacherId,
            courseId: args.courseId,
            category: args.category,
            available: true,
          },
        });
        return value;
      } else {
        return "unauthorized";
      }
    },

    note: async (parent, args, context) => {
      console.log(args);
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const value = await context.prisma.teacher_Note.findUnique({
          where: {
            id: args.id,
          },
        });
        return value;
      } else {
        return "unauthorized";
      }
    },

    auth: async (parent, args, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const val = { status: "authorized", id: payload.studentId };
        return JSON.stringify(val);
      } else {
        const val = { status: "unauthorized", id: "" };
        return JSON.stringify(val);
      }
    },
  },

  Mutation: {
    addStudentNote: async (parent, { input }, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const upadateDate = new Date();
        const newNote = {
          topic: input.topic,
          category: input.category,
          content: input.content,
          editableContent: input.editableContent,
          authorId: payload.studentId,
          updatedAt: upadateDate,
        };
        return await context.prisma.student_Note.create({
          data: newNote,
        });
      } else {
        return "unauthorized";
      }
    },

    addStudentTeacherCourse: async (parent, { input }, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const data = await context.prisma.class.findUnique({
          where: {
            classCode: input.classCode,
          },
          include: {
            courses: true,
          },
        });
        const classlist = [];
        data.courses.forEach((course) => {
          classlist.push({
            id: course.id,
          });
        });
        const inputData = {
          studentId: payload.studentId,
          classId: data.id,
          teacherId: data.teacherId,
          courseList: {
            connect: classlist,
          },
          verified: true,
        };

        return await context.prisma.student_Teacher_Course.create({
          data: inputData,
          include: {
            courseList: true,
            teacher: true,
            class: true,
          },
        });
      } else {
        return "unauthorized";
      }
    },

    updateStudentNote: async (parent, { input }, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const upadateDate = new Date();
        const newNote = {
          topic: input.topic,
          category: input.category,
          content: input.content,
          editableContent: input.editableContent,
          authorId: payload.studentId,
          updatedAt: upadateDate,
        };

        return await context.prisma.student_Note.update({
          where: {
            id: input.id,
          },
          data: newNote,
        });
      } else {
        return "unauthorized";
      }
    },

    deleteStudentNote: async (parent, { input }, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const noteId = {
          id: input.id,
        };

        await context.prisma.student_Note.delete({
          where: {
            id: noteId.id,
          },
        });

        return "done";
      } else {
        return "unauthorized";
      }
    },

    updateStudentProfile: async (parent, { input }, context) => {
      const { verified, payload } = isAuth(context.req);
      if (verified) {
        const upadateDate = new Date();
        const newInfo = {
          firstName: input.firstName,
          lastName: input.lastName,
          address: input.address,
          state: input.state,
          country: input.country,
          postalCode: input.postalCode,
          email: input.email,
          image: input.image,
          phoneNo: input.phoneNo,
          updatedAt: upadateDate,
          password: input.password,
        };
        return await context.prisma.student.update({
          where: {
            id: payload.studentId,
          },
          data: newInfo,
        });
      } else {
        return "unauthorized";
      }
    },

    createPasswordLink: async (parent, { input }, context) => {
      try {
        const val = await context.prisma.student.findUnique({
          where: {
            email: input.email,
          },
        });
        const inputVal = {
          to_email: val.email,
          message: `https://localhost:3000/auth/changepassword/${val.id}`,
          type: "new_password",
        };
        sendEmail(inputVal);
        return "Successful";
      } catch (e) {
        console.log(e);
        return "Failed";
      }
    },

    updatePassword: async (parent, { input }, context) => {
      try {
        const cookies = new Cookies(context.req, context.res, { secure: true });
        const password = input.newPassword;
        const hashedPassword = await bcrypt.hash(password, 12);
        await context.prisma.student.update({
          where: {
            id: input.link,
          },
          data: {
            password: hashedPassword,
          },
        });
        const access = (key, exp) => {
          return sign({ teacherId: "null" }, key, {
            expiresIn: exp,
          });
        };
        cookies.set("flip_classroom_auth_students", access(`null`, "0"), {
          httpOnly: true,
          path: "/",
          expires: 0,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production" ? true : false,
        });
        return "Verified";
      } catch (e) {
        console.log(e);
        return "Failed";
      }
    },

    createStudent: async (parent, { input }, context) => {
      const generateCode =
        Date.now().toString(36) +
        Math.floor(
          Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
        ).toString(36);
      const upadateDate = new Date();
      const password = input.password;
      const hashedPassword = await bcrypt.hash(password, 12);
      const info = {
        firstName: input.firstName,
        lastName: input.lastName,
        address: input.address,
        state: input.state,
        country: input.country,
        postalCode: input.postalCode,
        email: input.email,
        image: input.image,
        phoneNo: input.phoneNo,
        dateOfBirth: "",
        class: "",
        emailCode: generateCode,
        updatedAt: upadateDate,
        password: hashedPassword,
      };
      try {
        const val = await context.prisma.student.create({
          data: info,
        });
        const emailval = {
          to_email: input.email,
          message: generateCode,
          type: "signup",
        };
        try {
          sendEmail(emailval);
        } catch (error) {
          console.log(error);
          return "Server Error";
        }
        return val.email;
      } catch (e) {
        console.log(e);
        return "Duplicate Email";
      }
    },

    verifyEmail: async (parent, { input }, context) => {
      try {
        try {
          await context.prisma.student.update({
            where: {
              emailCode: input.code,
            },
            data: {
              verifiedEmail: true,
            },
          });
          return "Verified";
        } catch (error) {
          console.log(error);
        }
      } catch (e) {
        return "Failed";
      }
    },

    resendEmail: async (parent, { input }, context) => {
      try {
        const val = await context.prisma.student.findUnique({
          where: {
            email: input.email,
          },
        });
        const emailval = {
          to_email: input.email,
          message: val.emailCode,
          type: "signup",
        };
        try {
          sendEmail(emailval);
        } catch (e) {
          console.log(e);
        }
        return "Successful";
      } catch (e) {
        console.log(e);
        return "Failed";
      }
    },

    signIn: async (parent, { input }, context) => {
      const cookies = new Cookies(context.req, context.res, { secure: true });
      let cookieDate = new Date();
      cookieDate.setTime(cookieDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      cookieDate.toUTCString();
      const env = process.env.NODE_ENV;
      try {
        const val = await context.prisma.student.findUnique({
          where: {
            email: input.email,
          },
        });
        const verifyPassword = await bcrypt.compare(
          input.password,
          val.password
        );
        console.log(val, verifyPassword);
        if (val && val.verifiedEmail === false) return "Unverified Email";
        if (val == null || verifyPassword === false) {
          console.log("here");
          return "Failed";
        } else {
          const access = (key, exp) => {
            console.log(
              "🚀 ~ file: resolvers.js ~ line 377 ~ access ~ id",
              val.id
            );
            return sign({ studentId: val.id }, key, {
              expiresIn: exp,
            });
          };

          cookies.set(
            "flip_classroom_auth_students",
            access(`${process.env.NEXT_PUBLIC_JWT_COOKIE_TOKEN}`, "7d"),
            {
              httpOnly: true,
              path: "/",
              sameSite: "strict",
              expires: cookieDate,
              secure: process.env.NODE_ENV === "production" ? true : false,
            }
          );

          console.log(isAuth(context.req));
          return JSON.stringify({ status: "Verified", id: val.id });
        }
      } catch (e) {
        return JSON.stringify({ status: "Failed", id: "" });
      }
    },
  },
};
