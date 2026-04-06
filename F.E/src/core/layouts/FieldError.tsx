import React from "react";

interface FieldErrorProps {
  errors: errors[];
  field: string;
  className?: string;
}

export interface errors {
  field: string;
  message: string;
  messages?: string[];
}

export const setErrorForm = (errors: errors[]): any => {
  return errors.map((err) => {
    return { name: err.field, errors: err.messages ? err.messages : [err.message] };
  });
};

const FieldError: React.FC<FieldErrorProps> = ({ errors, field, className }) => {
  const error = errors?.find((err) => err?.field === field);
  if (!error) return null;
  if (error.message)
    return <div className={`text-danger text-sm mt-1 ${className}`}>{error.message}</div>;
  if (error.messages)
    return (
      <div className="flex flex-col gap-1">
        {error.messages.map((item, index) => (
          <div key={index} className={`text-danger text-sm mt-1 ${className}`}>
            {item}
          </div>
        ))}
      </div>
    );
};

export default FieldError;
