"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { LoaderCircle, Plus, Store, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { isEmailApproved } from "@/lib/checkEmail"; // Import the server-side function

export default function Layout({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    const currentPath = usePathname();
    const selectedColor = 'bg-white text-black';

    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!email) return;

        const checkEmail = async () => {
            try {
                // Call the server-side function
                const approved = await isEmailApproved(email);
                setIsVerified(approved);
            } catch (error) {
                console.error('Error checking email:', error);
            } finally {
                setLoading(false);
            }
        };

        checkEmail();
    }, [email]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin">
                    <LoaderCircle size={24} className="text-gray-500" />
                </div>
            </div>
        );
    }


    if (!isVerified) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center select-none">
                <div className="text-red-500 flex items-center space-x-2 m-2">
                    <User size={24} className="text-red-500" />
                    <span className="text-zinc-800 font-bold">Access Denied</span>
                </div>
                <p className="text-zinc-500">
                    You are not authorized to access this page.<br />
                    Contact an administrator for assistance.
                </p>
            </div>
        );
    }


    return (
        <div className="min-h-screen w-screen overflow-hidden">
            <div className="rounded-3xl p-2 sm:p-4 flex flex-col h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2rem)] 
                          w-[calc(100dvw-1rem)] sm:w-[calc(100dvw-2rem)] relative 
                          bg-gradient-to-tl from-blue-50 to-blue-50/50 
                          m-2 sm:m-4 box-border">

                <SignedIn>
                    <div className="absolute hidden sm:block top-2 sm:top-4 right-2 sm:right-4 scale-150 z-20">
                        <UserButton />
                    </div>
                </SignedIn>
                {children}
                <div className="rounded-full space-x-2 sm:space-x-3 inline-flex bg-slate-900 text-white 
                              items-center justify-between p-1 absolute bottom-2 sm:bottom-4 
                              left-1/2 transform -translate-x-1/2">

                    <Link href="/home" className={`flex items-center p-4 transition-all hover:-translate-y-1 rounded-full duration-300 ${currentPath === '/home' ? selectedColor : ''}`}>
                        <Store />
                    </Link>
                    {/* <Link href="/home/saved" className={`flex items-center p-4 transition-colors rounded-full duration-300 ${currentPath === '/home/saved' ? selectedColor : ''}`}>
                        <Heart />
                    </Link> */}
                    <Link href="/home/sell" className={`flex items-center p-4 transition-all hover:-translate-y-1 rounded-full duration-300 ${currentPath === '/home/sell' ? selectedColor : ''}`}>
                        <Plus />
                    </Link>
                    <Link href="/home/account" className={`flex items-center p-4 transition-all hover:-translate-y-1 rounded-full duration-300 ${currentPath === '/home/account' ? selectedColor : ''}`}>
                        <User />
                    </Link>
                </div>
            </div>
        </div>
    );
}
