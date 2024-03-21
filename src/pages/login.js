import React, { useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { get } from "lodash";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Card,
  CardContent,
  Button,
  Container,
  Grid,
  TextField,

} from "@mui/material";
import Image from "next/image";
import stationimg from "../icons/station.svg";
import logo from "../icons/logo.svg";
import green from "../icons/green.svg";
import { alpha, styled } from "@mui/material/styles";
import userApis from "../graphQL/users";
import { useLazyQuery, useMutation } from "@apollo/client";
import { setCookie, getCookie, Base64 } from "../utils/jsUtils";
import compose from "../utils/compose";
import { auth } from "../utils/ssrUtils";
import ErrorBox from "../components/ui/ErrorBox/ErrorBox";
import { WithUserCtx } from "../contexts/userContext";
import Swal from "sweetalert2";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#2ECE54",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#2ECE54",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#2ECE54",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2ECE54",
    },
  },
  "& .MuiFormHelperText-root.Mui-error": {
    marginTop: "10px",
  },
});

const CssGrid = styled(Grid)({
  "background-image": `url(${green})`,
});

const Login = ({ setUser }) => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { loginUser, getUser } = userApis;

  const [getUserData, { data: user, loading: userLoading }] = useLazyQuery(
    getUser,
    {
      variables: {
        userId: "",
      },
    }
  );

  const [handleLogin, { data, loading, error: err }] = useMutation(loginUser, {
    variables: {
      username: "",
      password: "",
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: (values) => {
      setError("");
      handleLogin({
        variables: {
          username: values.email,
          password: values.password,
        },
      });
    },
  });

  const handleUserRoute = (kind, resourceId) => {
    switch (kind) {
      case "CORP":
        return router.push(`/corporate-partner/${resourceId}`);
      case "ADMIN":
        return router.push("/");
      case "ISO":
        return router.push(`/iso/${resourceId}`);
      case "CPO":
        return router.push(`/partner/${resourceId}`);
      default:
        return "";
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 10000);
    }
  }, [error]);

  useEffect(() => {
    const loginData = get(data, "loginUser");
    if (loginData) {
      const validRole =
        get(loginData, "data.user.role") &&
        get(loginData, "data.user.role") !== null;
      if (get(loginData, "success") && validRole) {
        getUserData({
          variables: {
            userId: get(loginData, "data.user.id", ""),
          },
        });
        setUser(get(loginData, "data.user"));
        setCookie("uid", get(loginData, "data.user.id", ""));
        setCookie("token", get(loginData, "data.token", ""));
        sessionStorage.setItem('token', get(loginData, "data.token", ""));
        sessionStorage.setItem('uid', get(loginData, "data.user.id", ""));
        sessionStorage.setItem('role', get(loginData, "data.user.role", ""));
        sessionStorage.setItem('phone', get(loginData, "data.user.phone", ""));
        sessionStorage.setItem('kind', get(loginData, "data.user.kind", ""));
        sessionStorage.setItem('email', get(loginData, "data.user.email", ""));
        sessionStorage.setItem('name', get(loginData, "data.user.name", ""));
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have been logged in successfully!",
          timer: 3000, // Duration the alert will be shown (in milliseconds)
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        setError("Login Failed");
      }
    }
  }, [data]);

  useEffect(() => {
    const loginData = get(user, "User");
    if (loginData) {
      const resourceId = get(loginData, "resourceId", "");
      const kind = get(loginData, "kind", "");
      setCookie("resourceId", resourceId);
      setCookie("kind", kind);
      handleUserRoute(kind, resourceId);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Login | QuikPlugs</title>
      </Head>
      <Grid
        container
        spacing={3}
        sx={{
          backgroundColor: "#B8EAC4",
        }}
      >
        <Grid item md={8} xs={12}>
          <div
            style={{
              width: "100%",
              height: "100vh",
              backgroundColor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src={stationimg} alt="Charging Station" />
          </div>
        </Grid>
        <CssGrid
          item
          className="login-container"
          md={4}
          xs={12}
          sx={{
            position: "relative",
            height: "100vh",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                position: "relative",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                width: "100%",
              }}
            >
            </div>
          </div>
          <Container className="login-grid-container">
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    marginY: "20px",
                  }}
                >
                  <Image src={logo} alt="QuikPlugs" />
                </Box>

                <form onSubmit={formik.handleSubmit}>
                  <CssTextField
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    margin="normal"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                    variant="outlined"
                  />
                  <CssTextField
                    error={Boolean(
                      formik.touched.password && formik.errors.password
                    )}
                    fullWidth
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    label="Password"
                    margin="normal"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                    variant="outlined"
                  />
                  <Box>
                    <NextLink href='/forgotPassword'>
                      <Button variant="text" sx={{ fontSize: '10px', float: 'right' }} color='success'>
                        Forgot Password?
                      </Button>
                    </NextLink>
                  </Box>
                  <Box sx={{ py: 2, marginY: "12px" }}>
                    <Button
                      disabled={
                        loading ||
                        userLoading ||
                        !formik.values.password ||
                        !formik.values.email
                      }
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#2ECE54",
                        color: "#fff",
                        ":hover": {
                          backgroundColor: "#00c32e",
                        },
                        ":disabled": {
                          backgroundColor: "#2ece5475",
                          color: "#fff",
                        },
                      }}
                    >
                      Log In
                    </Button>
                    {error && (
                      <span
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          color: "#ff0000",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        {error}
                      </span>
                    )}
                  </Box>
                </form>
              </CardContent>
            </Card>

          </Container>
        </CssGrid>
      </Grid>
    </>
  );
};

export default WithUserCtx(Login);
export const getServerSideProps = compose(auth);
