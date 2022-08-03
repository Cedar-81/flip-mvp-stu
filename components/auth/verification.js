import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const Verify = gql`
  mutation VerifyEmail($input: verifyEmailInput) {
    verifyEmail(input: $input)
  }
`;

function Verification() {
  const router = useRouter();
  const [verify, { data, loading, error }] = useMutation(Verify);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [btntxt, setBtntxt] = useState("Verify");
  const [err_msg, setErrorMsg] = useState("");

  const checker = () => {
    if (email.trim().length == 0 || code.trim().length == 0) {
      setErrorMsg("*All fields must be filled");
      return "failed";
    } else if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false
    ) {
      setErrorMsg("*Please enter a valid email");
      return "failed";
    } else {
      setErrorMsg(" ");
      authorize();
      return "passed";
    }
  };

  if (loading) console.log("Creating...");
  if (error) console.log(JSON.stringify(error, null, 2));

  const authorize = async () => {
    const inputVal = {
      email,
      code,
    };
    setErrorMsg("...Verifying. Please wait.");
    setBtntxt("...Verifying");
    const create = await verify({
      variables: { input: inputVal },
    });
    if (create.data.verifyEmail === "Failed") {
      return (
        setErrorMsg("Invalid email or code, please try again"),
        setBtntxt("Verify")
      );
    }

    setErrorMsg("Verified");
    setBtntxt("Verified");

    setCode("");
    setEmail("");

    router.push("/auth/signin");

    setTimeout(() => {
      setErrorMsg("");
      setBtntxt("Verify");
    }, 5000);
  };

  return (
    <div className="w-full h-[100vh] fixed top-0 z-50 bg-main_color">
      <div className="w-[20rem] relative min-h-[11rem] h-max mt-[13%] bg-accent_bkg_color pt-[1rem] rounded-lg shadow-lg px-[1rem] mx-auto my-auto ">
        <p className="text-xl text-center mx-auto max-w-full overflow-hidden">
          Email Verification
        </p>
        <p className="text-xs text-left mt-1">
          Enter verification code that has been sent to you via your email upon
          sign up
        </p>
        <p className="text-xs text-center mt-8 mb-1 font-semibold text-accent_color">
          {err_msg}
        </p>
        <input
          type={"email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-10 px-2 mb-2 focus:shadow-lg focus:bg-main_color rounded-md outline-none"
          placeholder="Enter email"
        />
        <input
          type={"text"}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-10 px-2 focus:shadow-lg focus:bg-main_color rounded-md outline-none"
          placeholder="Enter code"
        />
        <div className="w-full flex justify-end">
          <button
            onClick={() => checker()}
            className="bg-accent_color cursor-pointer hover:shadow-md text-main_color px-4 relative mt-5 mb-5 py-1 rounded-md text-base"
          >
            {btntxt}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verification;