import { useState } from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import { submitCertificateRequest } from "../api";
import { certificateRequestValidationSchema } from "../schemas/certificateRequestSchema";
import type { CertificateRequestFormValues } from "../types";

const initialValues: CertificateRequestFormValues = {
  address_to: "",
  purpose: "",
  issued_on: "",
  employee_id: "",
};

export default function RequestCertificateForm() {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (
    values: CertificateRequestFormValues
  ): Promise<{ success: boolean; values: CertificateRequestFormValues }> => {
    setSubmitMessage(null);
    setSubmitError(null);

    const payload = {
      address_to: values.address_to.trim(),
      purpose: values.purpose.trim(),
      issued_on: values.issued_on,
      employee_id: values.employee_id.toString().trim(),
    };

    try {
      const response = await submitCertificateRequest(payload);

      if (response?.responce === "Ok") {
        setSubmitMessage(
          "Your certificate request has been submitted successfully."
        );
        return { success: true, values: initialValues };
      }

      setSubmitError(
        "The request was submitted but the response was not successful."
      );
      return { success: false, values };
    } catch {
      setSubmitError(
        "An error occurred while submitting your request. Please try again."
      );
      return { success: false, values };
    }
  };

  return (
    <section className="card">
      <header className="card-header">
        <h2>Request Certificate</h2>
        <p className="card-subtitle">
          Provide the details of the certificate you need. All fields are
          required.
        </p>
      </header>

      <Formik
        initialValues={initialValues}
        validationSchema={certificateRequestValidationSchema}
        onSubmit={async (values, { setValues, resetForm }) => {
          const { success, values: nextValues } = await handleSubmit(values);
          setValues(nextValues);
          if (success) resetForm({ values: initialValues });
        }}
        validateOnBlur
        validateOnChange
      >
        {({ isSubmitting, errors, touched, values }) => (
          <Form className="form" noValidate>
            <div className="form-row">
              <label htmlFor="address_to" className="form-label">
                Address to<span className="required">*</span>
              </label>
              <Field name="address_to">
                {({ field }: FieldProps<string>) => (
                  <textarea
                    id="address_to"
                    {...field}
                    className={
                      touched.address_to && errors.address_to
                        ? "form-input form-input--error"
                        : "form-input"
                    }
                    rows={3}
                    placeholder="E.g. Embassy of Neptun"
                  />
                )}
              </Field>
              {touched.address_to && errors.address_to && (
                <p className="form-error">{errors.address_to}</p>
              )}
            </div>

            <div className="form-row">
              <label htmlFor="purpose" className="form-label">
                Purpose<span className="required">*</span>
              </label>
              <Field name="purpose">
                {({ field }: FieldProps<string>) => (
                  <textarea
                    id="purpose"
                    {...field}
                    className={
                      touched.purpose && errors.purpose
                        ? "form-input form-input--error form-input--purpose"
                        : "form-input form-input--purpose"
                    }
                    rows={4}
                    placeholder="Describe the purpose of this certificate (minimum 50 characters)…"
                  />
                )}
              </Field>
              <div className="form-row-hint">
                <span
                  className={
                    values.purpose.trim().length < 50
                      ? "char-counter char-counter--warning"
                      : "char-counter"
                  }
                >
                  {values.purpose.trim().length} / 50 characters
                </span>
              </div>
              {touched.purpose && errors.purpose && (
                <p className="form-error">{errors.purpose}</p>
              )}
            </div>

            <div className="form-row form-row--inline">
              <div className="form-field-half">
                <label htmlFor="issued_on" className="form-label">
                  Issued on<span className="required">*</span>
                </label>
                <Field name="issued_on">
                  {({ field }: FieldProps<string>) => (
                    <input
                      id="issued_on"
                      type="date"
                      {...field}
                      className={
                        touched.issued_on && errors.issued_on
                          ? "form-input form-input--error"
                          : "form-input"
                      }
                    />
                  )}
                </Field>
                {touched.issued_on && errors.issued_on && (
                  <p className="form-error">{errors.issued_on}</p>
                )}
              </div>

              <div className="form-field-half">
                <label htmlFor="employee_id" className="form-label">
                  Employee ID<span className="required">*</span>
                </label>
                <Field name="employee_id">
                  {({ field }: FieldProps<string>) => (
                    <input
                      id="employee_id"
                      type="number"
                      {...field}
                      className={
                        touched.employee_id && errors.employee_id
                          ? "form-input form-input--error"
                          : "form-input"
                      }
                      placeholder="Numeric only"
                    />
                  )}
                </Field>
                {touched.employee_id && errors.employee_id && (
                  <p className="form-error">{errors.employee_id}</p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting…" : "Submit request"}
              </button>
            </div>

            {submitMessage && (
              <div className="alert alert--success" role="status">
                {submitMessage}
              </div>
            )}
            {submitError && (
              <div className="alert alert--error" role="alert">
                {submitError}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </section>
  );
}
