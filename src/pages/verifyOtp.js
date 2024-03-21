import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { WithCpoCtx } from "../contexts/cpoContext";
import { Box, Container, Card, Typography, CardMedia, CardContent, CardActions, Button, TextField } from "@mui/material";
import userApis from "../graphQL/users";
import { get } from "lodash";
import { useRouter } from "next/router";
import NextLink from "next/link";

const VerifyOtp = () => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState(false)
    const { VerifyLoginOTP } = userApis;

    const [handleVerifyLoginOTP, { data, loading, error: err }] = useMutation(VerifyLoginOTP, {
        variables: {
            id: "",
            otp: ""
        },
    });
    const handleSubmitOtp = (event) => {
        event.preventDefault()

        setOtpError(false)

        if (otp == '') {
            setOtpError(true)
        }

        if (otp) {
            handleVerifyLoginOTP({
                variables: {
                    id: sessionStorage.getItem('passwordUserId'),
                    otp: otp
                },
            });
        }
    }

    useEffect(() => {
        const verifyOtpRes = get(data, "verifyLoginOTP");
        console.log(verifyOtpRes, 'res')
        sessionStorage.setItem('resetToken', get(data, "verifyLoginOTP.data.resetToken"))
        if (get(data, "verifyLoginOTP.success") === true) {
            router.push('/newPassword');
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
                                Enter OTP sent to your phone number here!
                            </Typography>
                            <Box>
                                <TextField
                                    label="OTP"
                                    variant="standard"
                                    fullWidth
                                    name="otp"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    required
                                    error={otpError}
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <NextLink href='/forgotPassword'>
                                <Button size="small">Go Back</Button>
                            </NextLink>

                            <Button size="small" color="success" onClick={handleSubmitOtp}>Submit</Button>
                        </CardActions>
                    </Card>
                </Box>

            </Container>
        </Box>
    );
};

const VerifyOtpPage = WithCpoCtx(VerifyOtp);

export default VerifyOtpPage;
