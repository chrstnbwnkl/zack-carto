import React, { ReactElement } from "react";
interface ErrorProps {
  errorMessage: string;
}
const Error = ({ errorMessage }: ErrorProps): ReactElement => {
  return (
    <div
      className={`alert alert-error absolute left-1/2 top-36 w-auto -translate-x-1/2 -translate-y-1/2 transform shadow-lg transition-opacity ${
        errorMessage ? "z-1000" : "-z-1 invisible opacity-0"
      } `}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 flex-shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{errorMessage}</span>
      </div>
    </div>
  );
};

export default Error;
