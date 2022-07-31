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
        country: input.category,
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
