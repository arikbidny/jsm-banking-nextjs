'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import { authFormSchema } from '@/lib/utils'
import CustomInput from './CustomInput'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions'
import PlaidLink from '../PlaidLink'


const AuthForm = ({ type }: { type: string }) => {

    const router = useRouter();

    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const formSchema = authFormSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setIsLoading(true)
        try {
            // Sign up with Appwrite & create plaid token
            if (type === 'sign-up') {

                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password!
                }

                const newUser = await signUp(userData);

                setUser(newUser);
            }

            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password
                })

                if (response) router.push('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:gap-8'>
                <Link href='/' className='flex mb-12 cursor-pointer items-center gap-1'>
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="Horizon logo"
                    />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1'>
                        Horizon
                    </h1>
                </Link>

                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text-26 font-semibold text-gray-900'>
                        {user
                            ? 'Link Account'
                            : type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'
                        }
                        <p className='text-16 font-normal'>
                            {user
                                ? 'Link your account to get started'
                                : 'Please enter your details'
                            }
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className='flex flex-col gap-4'>
                    {/* PlaidLink */}
                    <PlaidLink user={user} variant="primary" />
                </div>
            ) :
                (
                    <>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                {type === 'sign-up' && (
                                    <>
                                        <div className='flex gap-4'>
                                            <CustomInput
                                                name="firstName"
                                                label='First Name'
                                                placeholder='Enter your first name'
                                                control={form.control}
                                            />
                                            <CustomInput
                                                name="lastName"
                                                label='Last Name'
                                                placeholder='Enter your last name'
                                                control={form.control}
                                            />
                                        </div>

                                        <CustomInput
                                            name="address1"
                                            label='Address'
                                            placeholder='Enter your specific address'
                                            control={form.control}
                                        />
                                        <CustomInput
                                            name="city"
                                            label='City'
                                            placeholder='Enter your city'
                                            control={form.control}
                                        />
                                        <div className='flex gap-4'>
                                            <CustomInput
                                                name="state"
                                                label='State'
                                                placeholder='Example: NY'
                                                control={form.control}
                                            />
                                            <CustomInput
                                                name="postalCode"
                                                label='Postal Code'
                                                placeholder='Example: 11101'
                                                control={form.control}
                                            />
                                        </div>
                                        <div className='flex gap-4'>
                                            <CustomInput
                                                name="dateOfBirth"
                                                label='Date of Birth'
                                                placeholder='YYYY-MM-DD'
                                                control={form.control}
                                            />
                                            <CustomInput
                                                name="ssn"
                                                label='SSN'
                                                placeholder='Example: 1234'
                                                control={form.control}
                                            />
                                        </div>
                                    </>
                                )}

                                <CustomInput
                                    name="email"
                                    label='email'
                                    placeholder='Enter your email'
                                    control={form.control}
                                />

                                <CustomInput
                                    name="password"
                                    label='password'
                                    placeholder='Enter your password'
                                    control={form.control}
                                />

                                <div className='flex flex-col gap-4'>
                                    <Button type="submit" disabled={isLoading}
                                        className='form-btn'>
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className='animate-spin' /> &nbsp;
                                                Loading...
                                            </>
                                        ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'
                                        }
                                    </Button>
                                </div>

                            </form>
                        </Form>

                        <footer className='flex justify-center gap-1'>
                            <p className='text-14 font-normal text-gray-600'>
                                {type === 'sign-in'
                                    ? "Don't have an account?"
                                    : "Already have an account?"
                                }
                            </p>
                            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className='form-link'>
                                {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                            </Link>
                        </footer>
                    </>
                )}
        </section>
    )
}

export default AuthForm