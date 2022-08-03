import { sign } from "jsonwebtoken";
const bcrypt = require("bcryptjs");
import Cookies from "cookies";
import isAuth from "./isAuth";

var http = require("https");

const sendEmail = (email, code) => {
  var options = {
    method: "POST",
    hostname: "emailapi.netcorecloud.net",
    port: null,
    path: "/v5/mail/send",
    headers: {
      api_key: `${process.env.EMAIL_API_KEY}`,
      "content-type": "application/json",
    },
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  req.write(
    JSON.stringify({
      from: {
        email: "redatetech@gmail.com",
        name: "Flip Classroom",
      },
      subject: "Flip Classroom Email Verification Code",
      content: [
        {
          type: "html",
          value: `
          <html lang="en">
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
                <p style="font-size: 50px">${code}</p>
              </div>
            </body>
          </html>
`,
        },
      ],
      personalizations: [{ to: [{ email: `${email}` }] }],
    })
  );
  req.end();
};

export const resolvers = {
  Query: {
    studentteachercourse: async (parent, args, context) => {
      console.log(args.studentId);
      const value = await context.prisma.student_Teacher_Course.findMany({
        where: {
          studentId: args.studentId,
          verified: true,
        },
        include: {
          teacher: true,
          courseList: true,
          class: true,
        },
      });
      return value;
    },

    student: async (parent, args, context) => {
      return await context.prisma.student.findUnique({
        where: {
          id: args.studentId,
        },
      });
    },

    personal_notes: async (parent, args, context) => {
      return await context.prisma.student_Note.findMany({
        where: {
          authorId: args.studentId,
        },
      });
    },

    personal_note: async (parent, args, context) => {
      return await context.prisma.student_Note.findUnique({
        where: {
          id: args.id,
        },
      });
    },

    notes: async (parent, args, context) => {
      const value = await context.prisma.teacher_Note.findMany({
        where: {
          teacherId: args.teacherId,
          courseId: args.courseId,
          category: args.category,
          available: true,
        },
      });
      return value;
    },

    note: async (parent, args, context) => {
      console.log(args);
      const value = await context.prisma.teacher_Note.findUnique({
        where: {
          id: args.id,
        },
      });
      return value;
    },

    //   courses: async (parent, args, context) => {
    //     return await context.prisma.course.findMany();
    //   },

    //   classes: async (parent, args, context) => {
    //     return await context.prisma.class.findMany({
    //       where: {
    //         id: args.id,
    //       },
    //       include: {
    //         courses: true,
    //       },
    //     });
    //   },

    //   class: async (parent, args, context) => {
    //     const value = await context.prisma.class.findMany({
    //       where: {
    //         id: args.id,
    //       },
    //       include: {
    //         courses: true,
    //       },
    //     });
    //     return value.find((_class) => _class.teacherId === args.teacherId);
    //   },

    //   teacher: async (parent, args, context) => {
    //     const value = await context.prisma.teacher.findUnique({
    //       where: {
    //         id: args.teacherId,
    //       },
    //       include: {
    //         classes: {
    //           include: {
    //             courses: true,
    //           },
    //         },
    //       },
    //     });
    //     return value;
    //   },
  },

  Mutation: {
    addStudentNote: async (parent, { input }, context) => {
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
    },

    addStudentTeacherCourse: async (parent, { input }, context) => {
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
        studentId: input.studentId,
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
    },

    updateStudentNote: async (parent, { input }, context) => {
      const upadateDate = new Date();
      const newNote = {
        topic: input.topic,
        category: input.category,
        content: input.content,
        editableContent: input.editableContent,
        authorId: input.authorId,
        updatedAt: upadateDate,
      };

      return await context.prisma.student_Note.update({
        where: {
          id: input.id,
        },
        data: newNote,
      });
    },

    deleteStudentNote: async (parent, { input }, context) => {
      const noteId = {
        id: input.id,
      };

      await context.prisma.student_Note.delete({
        where: {
          id: noteId.id,
        },
      });

      return "done";
    },

    updateStudentProfile: async (parent, { input }, context) => {
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
          id: input.id,
        },
        data: newInfo,
      });
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
        sendEmail(input.email, generateCode);
        return "Successful";
      } catch (e) {
        console.log(e);
        return "Duplicate Email";
      }
    },

    verifyEmail: async (parent, { input }, context) => {
      try {
        const val = await context.prisma.student.findUnique({
          where: {
            email: input.email,
          },
        });
        if (val !== null && val.emailCode === input.code) {
          return "Verified";
        }
        return "Failed";
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
        if (val == null || !verifyPassword)
          return "Invalid username or password";

        const access = (key, exp) => {
          return {
            accessToken: sign({ studentId: val.studentId }, key, {
              expiresIn: exp,
            }),
          };
        };

        cookies.set(
          "Flip auth cookie",
          access(process.env.JWT_COOKIE_TOKEN, "7d"),
          {
            httpOnly: true,
            domain: "http://localhost:3000",
            path: "/auth/signin",
            secure: env === "production" ? true : false,
          }
        );

        isAuth(cookies);
        return JSON.stringify(access(process.env.JWT_ACCESS_TOKEN, "15m"));
      } catch (e) {
        console.log(e);
        return "Failed";
      }
    },
  },

  // Mutation: {
  //   addTeacherNote: async (parent, { input }, context) => {
  //     const upadateDate = new Date();
  //     const newNote = {
  //       topic: input.topic,
  //       classId: input.classId,
  //       courseId: input.courseId,
  //       category: input.category,
  //       content: input.content,
  //       editableContent: input.editableContent,
  //       authorId: input.authorId,
  //       updatedAt: upadateDate,
  //     };

  //     return await context.prisma.teacher_Note.create({
  //       data: newNote,
  //     });
  //   },

  //   updateTeacherNote: async (parent, { input }, context) => {
  //     const upadateDate = new Date();
  //     const newNote = {
  //       topic: input.topic,
  //       classId: input.classId,
  //       courseId: input.courseId,
  //       category: input.category,
  //       content: input.content,
  //       editableContent: input.editableContent,
  //       authorId: input.authorId,
  //       updatedAt: upadateDate,
  //     };

  //     return await context.prisma.teacher_Note.update({
  //       where: {
  //         id: input.id,
  //       },
  //       data: newNote,
  //     });
  //   },

  //   deleteTeacherNote: async (parent, { input }, context) => {
  //     const noteId = {
  //       id: input.id,
  //     };

  //     await context.prisma.teacher_Note.delete({
  //       where: {
  //         id: noteId.id,
  //       },
  //     });

  //     return "done";
  //   },

  //   updateTeacherProfile: async (parent, { input }, context) => {
  //     const upadateDate = new Date();
  //     const newInfo = {
  //       firstName: input.firstName,
  //       lastName: input.lastName,
  //       address: input.address,
  //       state: input.state,
  //       country: input.category,
  //       postalCode: input.postalCode,
  //       email: input.email,
  //       image: input.image,
  //       phoneNo: input.phoneNo,
  //       updatedAt: upadateDate,
  //       password: input.password,
  //     };

  //     return await context.prisma.teacher.update({
  //       where: {
  //         id: input.id,
  //       },
  //       data: newInfo,
  //     });
  //   },
  // },
};
