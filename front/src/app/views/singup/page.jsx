"use client";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { FormHelperText } from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";

import firebaseApp from "../../../firebase";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
const auth = getAuth(firebaseApp);

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
export default function SignUp() {
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const route = useRouter();

  const { signup } = useAuth();
  const onSubmitSignUp = async (data) => {
    try {
      await signup(data.email, data.password, data.nombre, data.apellido);
      toast.success("Usuario registrado con exito");
      route.push("/views/login");
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/missing-password") {
        toast.error("Te faltó colocar la contraseña");
      }
      if (error.code === "auth/weak-password") {
        toast.error("La contraseña debe tener más de 6 caracteres");
      }
      if (error.code === "auth/email-already-in-use") {
        toast.error("Ya existe una cuenta con ese correo");
      }
      //
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
            Registrate
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmitSignUp)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="nombre"
                  required
                  fullWidth
                  id="Nombre"
                  label="Nombre"
                  autoFocus
                  error={!!errors?.nombre}
                  {...register("nombre", { required: true })}
                />
                {errors.nombre?.type === "required" && (
                  <FormHelperText error={true}>
                    Nombre Requerido*
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="Apellido"
                  label="Apellido"
                  name="apellido"
                  autoComplete="family-name"
                  error={!!errors?.apellido}
                  {...register("apellido", { required: true })}
                />
                {errors.apellido?.type === "required" && (
                  <FormHelperText error={true}>
                    Apellido Requerido*
                  </FormHelperText>
                )}
              </Grid>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrate
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href={"/views/login"}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    fontSize: "15px",
                  }}
                >
                  ¿Ya tienes una cuenta? Iniciar sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
