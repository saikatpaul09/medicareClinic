import MuiButton, { type ButtonProps } from "@mui/material/Button";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary";
  sx?: object;
  onClick?: () => void;
}

export const Button = ({
  children,
  variant = "contained",
  color = "primary",
  sx,
  onClick,
  ...rest
}: CustomButtonProps) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      sx={{ borderRadius: "20px", textTransform: "none", ...sx }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </MuiButton>
  );
};
