import { useEffect, useMemo, useState, ChangeEvent } from 'react';

// Definiendo tipos para el formulario y las validaciones
type FormState = { [key: string]: any };
type ValidationFunction = (value: any) => boolean;
type FormValidations = {
  [key: string]: [ValidationFunction, string];
};

export const useForm = (
  initialForm: FormState = {},
  formValidations: FormValidations = {}
) => {
  const [formState, setFormState] = useState<FormState>(initialForm);
  const [formValidation, setFormValidation] = useState<{
    [key: string]: string | null;
  }>({});

  useEffect(() => {
    createValidators();
  }, [formState]);

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  const isFormValid = useMemo(
    () => Object.values(formValidation).every(value => value === null),
    [formValidation]
  );

  const onInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const createValidators = () => {
    const formCheckedValues: { [key: string]: string | null } = {};
    for (const formField in formValidations) {
      const [fn, errorMessage] = formValidations[formField];
      formCheckedValues[`${formField}Valid`] = fn(formState[formField])
        ? null
        : errorMessage;
    }
    setFormValidation(formCheckedValues);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    ...formValidation,
    formValidation,
    isFormValid
  };
};
