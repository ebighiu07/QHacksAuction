"use client"
import { useRouter } from 'next/navigation';
import { SignIn, SignedIn, SignedOut } from '@clerk/nextjs';
import Image from "next/image";

export default function SignUp() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen grid grid-cols-1 sm:grid-cols-2 text-zinc-900 overflow-hidden">
      <div className="relative bg-gray-200 rounded-2xl m-5">
        <div className="absolute top-0 left-0 p-4 text-white text-4xl font-bold z-20">
          Next<span className="font-black">Bid</span>
        </div>
        <Image
          src="/signup/page_thumb.jpg"
          layout="fill"
          objectFit="cover"
          alt="Sign in"
          className="rounded-3xl"
        />
      </div>
      <div className="flex flex-col items-center justify-center p-5 m-5 ml-7">
        <SignedOut>
          <SignIn routing='hash' />
        </SignedOut>
        <SignedIn>
          {/* Proceed to app */}
          <button onClick={() => router.push('/home')} className="text-zinc-600 p-2 rounded-lg underline text-2xl ">
            Proceed to app
          </button>
        </SignedIn>
      </div>
    </div>
  );
}