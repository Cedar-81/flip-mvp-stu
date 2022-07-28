import React, { useContext, useEffect, useState } from "react";
import { StudentContext } from "../../contexts/studentcontext";
import { gql, useMutation, useQuery } from "@apollo/client";

const UpdateStudentProfile = gql`
  mutation UpdateStudentProfile($input: updateStudentProfileInput) {
    updateStudentProfile(input: $input) {
      firstName
      lastName
      password
    }
  }
`;

const GetStudentProfile = gql`
  query Student($studentId: ID!) {
    student(studentId: $studentId) {
      firstName
      lastName
      address
      state
      country
      postalCode
      email
      image
      dateOfBirth
      phoneNo
      password
    }
  }
`;

function Personaldets() {
  const { setTopbaraction, studentprofile, studentid, setStudentprofile } =
    useContext(StudentContext);

  const [saver, setSaver] = useState(false);
  const [showinstruction, setShowinstruction] = useState(true);

  const styles = {
    input:
      "flex h-[3rem] text-lg font-medium rounded-md focus:shadow-lg focus:bg-main_color text-dark_color bg-accent_bkg_color py-1 my-4 w-full pl-3 outline-none",
  };

  const {
    data: init_data,
    error: init_error,
    loading: init_loading,
  } = useQuery(GetStudentProfile, {
    variables: {
      studentId: studentid,
    },
  });

  let val = "...";
  if (init_loading) {
    val = "...";
  }
  if (init_error) {
    console.log(JSON.stringify(error, null, 2));
  }

  const [updatestudentprofile, { data, loading, error }] = useMutation(
    UpdateStudentProfile,
    {
      update(_, result) {
        // setCreatednoteid(result.data.addTeacherNote.id);
      },
      refetchQueries: [
        { query: GetStudentProfile, variables: { studentId: studentid } },
        "Student",
      ],
    }
  );

  if (loading) console.log("Updating...");
  if (error) console.log(JSON.stringify(error, null, 2));

  const update_student_profile = () => {
    const inputVal = {
      id: studentid,
      firstName: studentprofile.firstname,
      lastName: studentprofile.lastname,
      address: studentprofile.address,
      state: studentprofile.state,
      country: studentprofile.country,
      postalCode: studentprofile.postal_code,
      email: studentprofile.email,
      image: studentprofile.image,
      phoneNo: studentprofile.tel,
      password: studentprofile.old_password,
    };
    updatestudentprofile({ variables: { input: inputVal } });
  };

  const get_student_info = (e) => {
    setSaver(true);
    setShowinstruction(false);
    setStudentprofile({ ...studentprofile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (init_data) {
      setStudentprofile({
        firstname: init_data.student.firstName,
        lastname: init_data.student.lastName,
        address: init_data.student.address,
        email: init_data.student.email,
        tel: init_data.student.phoneNo,
        country: init_data.student.country,
        state: init_data.student.state,
        image: init_data.student.image,
        postal_code: init_data.student.postalCode,
        old_password: init_data.student.password,
        new_password: "",
        confirm_password: "",
      });
    }
    // updatestudentprofile();
  }, [init_data]);

  const update = () => {
    if (init_data) {
      update_student_profile();
    }
    setSaver(false);
    setShowinstruction(true);
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.getElementById(
        "bckimg"
      ).style.backgroundImage = `url(${studentprofile.image})`;
    }
  }, [studentprofile]);

  return (
    <div className="w-[98%] md:w-[70%] mx-auto mt-9 h-full">
      {showinstruction && (
        <div className="text-sm text-center mb-4">
          <p className="text-accent_color">Click on any info field to edit</p>
        </div>
      )}
      <div
        onClick={() => setTopbaraction("Settings")}
        className="back cursor-pointer left-4 top-[40%]"
      >
        <span className="material-icons text-accent_color">arrow_back_ios</span>
      </div>
      {/* <button className="w-[7rem] py-2 font-semibold text-md top-[13%] hover:border-2 hover:text-accent_color hover:shadow-md hover:bg-[transparent] hover:border-accent_color fixed right-8 bg-accent_color text-main_color rounded-full">
        Save
      </button> */}
      <div className="w-full">
        <div
          id="bckimg"
          className={`w-[10rem] mx-auto h-[10rem] bg-cover bg-center bg-no-repeat rounded-full bckimg`}
        ></div>
        <p className="name text-center mt-3 text-xl font-semibold">
          {studentprofile.firstname + " " + studentprofile.lastname}
        </p>
        <div className="w-[7rem] mx-auto mt-4">
          <input
            onChange={get_student_info}
            name="image"
            type={"file"}
            className="block cursor-pointer file:font-medium file:cursor-pointer w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:text-dark_color file:bg-accent_color_2"
          />
        </div>
      </div>
      <input
        onChange={get_student_info}
        type={"text"}
        name="firstname"
        value={studentprofile?.firstname}
        className={`input ${styles.input}`}
        placeholder="First name"
      />
      <input
        onChange={get_student_info}
        type={"text"}
        name="lastname"
        value={studentprofile?.lastname}
        className={`input ${styles.input}`}
        placeholder="Last name"
      />
      <input
        onChange={get_student_info}
        type={"text"}
        name="address"
        value={studentprofile?.address}
        className={`input ${styles.input}`}
        placeholder="Address"
      />
      <input
        onChange={get_student_info}
        type={"text"}
        name="state"
        value={studentprofile?.state}
        className={`input ${styles.input}`}
        placeholder="State"
      />
      <input
        onChange={get_student_info}
        type={"text"}
        name="country"
        value={studentprofile?.country}
        className={`input ${styles.input}`}
        placeholder="Country"
      />
      <input
        onChange={get_student_info}
        type={"text"}
        name="postal_code"
        value={studentprofile?.postal_code}
        className={`input ${styles.input}`}
        placeholder="Postal Code"
      />
      <input
        onChange={get_student_info}
        type={"text"}
        name="email"
        value={studentprofile?.email}
        className={`input ${styles.input}`}
        placeholder="Email"
      />
      <input
        onChange={get_student_info}
        type={"tel"}
        name="tel"
        value={studentprofile.tel}
        className={`input ${styles.input}`}
        placeholder="Phone no"
      />
      <input
        onChange={get_student_info}
        type={"password"}
        name="old_password"
        value={studentprofile.old_password}
        className={`input ${styles.input}`}
        placeholder="Old Password"
        disabled
      />
      <input
        onChange={get_student_info}
        type={"password"}
        name="new_password"
        value={studentprofile?.new_password}
        className={`input ${styles.input}`}
        placeholder="New Password"
      />
      <input
        onChange={get_student_info}
        type={"password"}
        value={studentprofile?.confirm_password}
        name="confirm_password"
        className={`input ${styles.input}`}
        placeholder="Confirm New Password"
      />
      {saver && (
        <button
          onClick={update}
          className="fixed right-9 bottom-8 w-[6rem] h-[2.5rem] rounded-md bg-accent_color text-main_color cursor-pointer border-2"
        >
          Done
        </button>
      )}
      <div className="h-11"></div>
    </div>
  );
}

export default Personaldets;
