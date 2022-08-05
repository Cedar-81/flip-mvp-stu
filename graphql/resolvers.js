import { sign } from "jsonwebtoken";
const bcrypt = require("bcryptjs");
import Cookies from "cookies";
import isAuth from "./isAuth";
const nodemailer = require("nodemailer");

const sendEmail = async (val) => {
  let testAccount = await nodemailer.createTestAccount();
  var smtpTransport = require("nodemailer-smtp-transport");
  console.log(process.env.APP_EMAIL, process.env.APP_PASSWORD);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: `${process.env.APP_EMAIL}`, // generated ethereal user
        pass: `${process.env.APP_PASSWORD}`, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  );

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Flip Classroom" <readatetech@gmail.com>`, // sender address
    to: `${val.to_email}`, // list of receivers
    subject: "Flip Classroom Email Verification", // Subject line
    // text: "Hello world?", // plain text body
    html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,600;1,700;1,800;1,900&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Roboto:wght@300&display=swap"
      rel="stylesheet"
    />
    <title>Flip Classroom Email Verification</title>
  </head>
  <body style="font-family: 'Fira Sans', sans-serif">
    <div
      style="
        height: max-content;
        width: 100%;
        background-color: rgb(27, 27, 27);
        text-align: center;
        color: white;
        padding: 2rem 0;
      "
    >
      <h2 style="">Email Verification</h2>
      <h3 style="width: 90%; margin: auto; font-size: small">
        This is an email verification code from flip classroom, if you didn't
        signup for this please ignore
      </h3>
      <p style="font-size: 50px">Code: ${val.message}</p>
    </div>
  </body>
</html>`, // html body
  });
};

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
            teacherId: args.teacherId,
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
        return "authorized";
      } else {
        return "unauthorized";
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
          authorId: input.authorId,
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
        };
        try {
          sendEmail(emailval);
        } catch (error) {
          console.log(error);
        }
        return "Successful";
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

    signIn: async (parent, { input }, context) => {
      const cookies = new Cookies(context.req, context.res);
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

          cookies.set("auth", access(process.env.JWT_COOKIE_TOKEN, "7d"), {
            httpOnly: true,
            path: "/",
            maxAge: 3600 * 24 * 7,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production" ? true : false,
          });

          console.log(isAuth(context.req));
          return "Verified";
        }
      } catch (e) {
        return e;
        return "Failed";
      }
    },
  },
};
