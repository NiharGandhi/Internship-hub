"use client"
import React, { useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OTPInput } from 'input-otp';
import { Label } from '@/components/ui/label';

const ForgotPasswordPage: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    // If the user is already signed in,
    if (isSignedIn) {
        router.push('/home');
    }

    // Send the password reset code to the user's email
    async function create(e: React.FormEvent) {
        e.preventDefault();
        await signIn
            ?.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            .then(_ => {
                setSuccessfulCreation(true);
                setError('');
            })
            .catch(err => {
                console.error('error', err.errors[0].longMessage);
                setError(err.errors[0].longMessage);
            });
    }

    // Reset the user's password. 
    // Upon successful reset, the user will be 
    // signed in and redirected to the home page
    async function reset(e: React.FormEvent) {
        e.preventDefault();
        await signIn
            ?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })
            .then(result => {
                // Check if 2FA is required
                if (result.status === 'needs_second_factor') {
                    setSecondFactor(true);
                    setError('');
                } else if (result.status === 'complete') {
                    // Set the active session to 
                    // the newly created session (user is now signed in)
                    setActive({ session: result.createdSessionId });
                    setError('');
                } else {
                    console.log(result);
                }
            })
            .catch(err => {
                console.error('error', err.errors[0].longMessage)
                setError(err.errors[0].longMessage);
            });
    }

    return (
        <div
            style={{
                margin: 'auto',
                maxWidth: '500px',
            }}
        >
            <h2 className="text-gravel md:text-4xl font-bold">Forgot Password?</h2>
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1em',
                }}
                onSubmit={!successfulCreation ? create : reset}
            >
                {!successfulCreation && (
                    <>
                        <label htmlFor='email'>Please provide your email address</label>
                        <Input
                            type='email'
                            placeholder='e.g john@doe.com'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <Button>Send password reset code</Button>
                        {error && <p>{error}</p>}
                    </>
                )}

                {successfulCreation && (
                    <>
                        <Label htmlFor='password'>Enter your new password</Label>
                        <Input
                            type='password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <Label htmlFor='password'>Enter the password reset code that was sent to your email</Label>
                        <Input
                            type='text'
                            value={code}
                            onChange={e => setCode(e.target.value)}
                        />

                        <button>Reset</button>
                        {error && <p>{error}</p>}
                    </>
                )}

                {secondFactor && <p>2FA is required, but this UI does not handle that</p>}
            </form>
        </div>
    );
};

export default ForgotPasswordPage;