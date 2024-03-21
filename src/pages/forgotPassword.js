import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { WithCpoCtx } from "../contexts/cpoContext";
import { Box, Container, Card, Typography, CardMedia, CardContent, CardActions, Button, TextField } from "@mui/material";
import userApis from "../graphQL/users";
import { get } from "lodash";
import { useRouter } from "next/router";
import NextLink from "next/link";

const ForgotPassword = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(false)
    const { ForgetPassword } = userApis;
    console.log(username, 'name')

    const [handleForgetPassword, { data, loading, error: err }] = useMutation(ForgetPassword, {
        variables: {
            username: "",
        },
    });
    const handleSubmitUsername = (event) => {
        event.preventDefault()

        setUsernameError(false)

        if (username == '') {
            setUsernameError(true)
        }

        if (username) {
            handleForgetPassword({
                variables: {
                    username: username
                },
            });
        }
    }

    useEffect(() => {
        const forgotPasswordRes = get(data, "forgetPassword");
        console.log(forgotPasswordRes, 'res')
        sessionStorage.setItem('passwordUserId', get(data, "forgetPassword.data.id"))
        if (get(data, "forgetPassword.success") === true) {
            router.push('/verifyOtp');
        }
    }, [data])
    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 2,
                overflow: "auto",
            }}
        >
            <Container maxWidth="xl" sx={{ alignItems: "center" }}>
                <Card sx={{ position: "relative", margin: "0 25px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ m: 3 }} variant="h4">
                            Reset Password
                        </Typography>
                    </div>
                </Card>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    mt: 20
                }}>
                    <Card sx={{ maxWidth: 500, minWidth: 500 }}>
                        <CardContent>
                            <Typography component="text">
                                Enter your Email or phone number here!
                            </Typography>
                            <Box>
                                <TextField
                                    label="Username"
                                    variant="standard"
                                    fullWidth
                                    name="username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    required
                                    error={usernameError}
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <NextLink href='/login'>
                                <Button size="small">Go Back</Button>
                            </NextLink>
                            <Button size="small" color="success" onClick={handleSubmitUsername}>Submit</Button>
                        </CardActions>
                    </Card>
                </Box>

            </Container>
        </Box>
    );
};

const ForgotPage = WithCpoCtx(ForgotPassword);

export default ForgotPage;
