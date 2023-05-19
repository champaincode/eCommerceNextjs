"use client";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormHelperText } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../../context/authContext";
import { useCartContext } from "@/app/context/cartContext";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import { useProductsContext } from "@/app/context/productsContext";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const route = useRouter();
  const { login, user } = useAuth();
  const { loadCartFromFirestore } = useCartContext();

  const onSubmitLogin = async (data) => {
    try {
      await login(data.email, data.password);

      toast.success(`Bienvenido al store ${data.email}`);
      route.push("/");
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/missing-password") {
        toast.error("Te faltó colocar la contraseña");
      }
      if (error.code === "auth/wrong-password") {
        toast.error("Contraseña Incorrecta");
      }
      if (error.code === "auth/too-many-requests") {
        toast.error("Upss, Surgió un problema. Intentalo de Nuevo más tarde");
      } else if (error.code === "auth/user-not-found") {
        toast.error(`No existe un usuario con email ${data.email} `);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitLogin)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  error={!!errors?.email}
                  autoComplete="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                  })}
                />{" "}
                {errors.email?.type === "required" && (
                  <FormHelperText error={true}>Email Requerido*</FormHelperText>
                )}
                {errors.email?.type === "pattern" && (
                  <FormHelperText error={true}>
                    El formato del email es incorrecto*
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!errors?.password}
                  {...register("password", { required: true, minLength: 6 })}
                />
                {errors.password?.type === "required" && (
                  <FormHelperText error={true}>
                    Contraseña Requerida*
                  </FormHelperText>
                )}
                {errors.password?.type === "minLength" && (
                  <FormHelperText error={true}>
                    la contraseña tiene que tener minimo 6 caracteres
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordar contraseña"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href={"/views/forgetpassword"}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    fontSize: "15px",
                  }}
                >
                  Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href={"/views/singup"}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    fontSize: "15px",
                  }}
                >
                  {"No tenes cuenta? Registrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
