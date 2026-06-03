import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";

export const TextField = ({
  label,
  required,
  variant = "outlined",
  fullWidth,
  value,
  onChange,
  ...rest
}: TextFieldProps) => {
  return (
    <MuiTextField
      label={label}
      required={required}
      variant={variant}
      fullWidth={fullWidth}
      margin="normal"
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};
