import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { WithCpoCtx } from "../contexts/cpoContext";
import { Box, Container, Card, Typography, CardMedia, CardContent, CardActions, Button, TextField } from "@mui/material";
import userApis from "../graphQL/users";
import { get } from "lodash";
import { useRouter } from "next/router";
import NextLink from "next/link";

const NewPassword = () => {
    const router = useRouter();
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [newPassError, setsetNewPassError] = useState(false);
    const [confirmPassError, setConfirmPassError] = useState(false)
    const { ResetPassword } = userApis;

    const [handleResetPassword, { data, loading, error: err }] = useMutation(ResetPassword, {
        variables: {
            id: "",
            token: "",
            password: ""
        },
    });
    const handleSubmitPass = (event) => {
        event.preventDefault()

        setsetNewPassError(false)
        setConfirmPassError(false)
        if (newPass == '') {
            setsetNewPassError(true)
        }
        if (confirmPass == '') {
            setConfirmPassError(true)
        }
        if (confirmPass !== newPass) {
            setConfirmPassError(true)
        }

        if (newPass && confirmPass && confirmPassError !== true) {
            handleResetPassword({
                variables: {
                    id: sessionStorage.getItem('passwordUserId'),
                    token: sessionStorage.getItem('resetToken'),
                    password: newPass
                },
            });
        }
    }

    useEffect(() => {
        const newPassRes = get(data, "resetPassword");
        console.log(newPassRes, 'res')
        if (get(data, "resetPassword.success") === true) {
            router.push('/login');
            sessionStorage.clear();
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
                                Please se your new password here!
                            </Typography>
                            <Box>
                                <TextField
                                    label="New Password"
                                    variant="standard"
                                    fullWidth
                                    name="newPass"
                                    type="password"
                                    value={newPass}
                                    onChange={e => setNewPass(e.target.value)}
                                    required
                                    error={newPassError}
                                />
                                <TextField
                                    label="Confirm Password"
                                    variant="standard"
                                    fullWidth
                                    name="ConfirmPass"
                                    type="password"
                                    value={confirmPass}
                                    onChange={e => setConfirmPass(e.target.value)}
                                    required
                                    error={confirmPassError}
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <NextLink href='/verifyOtp'>
                                <Button size="small">Go Back</Button>
                            </NextLink>
                            <Button size="small" color="success" onClick={handleSubmitPass}>Submit</Button>
                        </CardActions>
                    </Card>
                </Box>

            </Container>
        </Box>
    );
};

const NewPasswordPage = WithCpoCtx(NewPassword);

export default NewPasswordPage;
