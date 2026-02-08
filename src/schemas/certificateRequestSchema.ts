import * as Yup from "yup";

function isFutureDate(value: string): boolean {
  if (!value) return false;
  const inputDate = new Date(value);
  const today = new Date();
  return (
    inputDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)
  );
}

export const certificateRequestValidationSchema = Yup.object({
  address_to: Yup.string()
    .trim()
    .required("Address to is required.")
    .matches(
      /^[a-zA-Z0-9\s,.'-]+$/,
      "Address to must contain only alphanumeric characters and basic punctuation."
    ),
  purpose: Yup.string()
    .trim()
    .required("Purpose is required.")
    .min(50, "Purpose must be at least 50 characters long."),
  issued_on: Yup.string()
    .required("Issued on date is required.")
    .test("future", "Issued on date must be a future date.", (value) =>
      value ? isFutureDate(value) : false
    ),
  employee_id: Yup.number()
    .required("Employee ID is required.")
});
