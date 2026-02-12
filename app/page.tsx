'use client';
import Image from "next/image";
import logo from "../public/quran.png";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const expire = localStorage.getItem('expire');
    const role = localStorage.getItem('role');

    if (accessToken && expire && role) {
      const expireDate = new Date(expire);
      const now = new Date();
      
      if (expireDate > now) {
        router.push('./platform/dashboard');
      } else {
        // Clear expired tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('expire');
      }
    }
  }, [router]);
  
  return (
    <div className="flex w-full min-h-screen justify-center flex-row bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen flex-col items-start justify-between py-32 px-16 lg:items-start">
        <Image
          className="dark:invert"
          src={logo}
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-start sm:items-start sm:text-left">
          <h1 className="max-w-xs lg:text-[100px] text-5xl font-semibold leading-10 tracking-tight text-slate-900 dark:text-zinc-50">
            Wahy
          </h1>
          <p className="max-w-md mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            An islamic platform to help sheikhs{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              supervise
            </a>{" "}
            and{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              monitor
            </a>{" "}
            their students and their progress.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-4 text-base font-medium lg:flex-row">
          <Button
            className="w-39.5 lg:text-xl flex h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-100 hover:border-slate-800 border md:w-75 md:h-20"
            rel="noopener noreferrer"
            onClick={() => {
              localStorage.setItem('role', 'admin');
              window.location.href = './platform/auth/login';
            }}
          >
            Admin Login
          </Button>
          <Button
            variant="outline"
            className="flex lg:text-xl h-12 w-39.5 items-center justify-center rounded-full border border-solid text-slate-900 border-slate-900 px-5 transition-colors hover:bg-black/4 md:w-75 md:h-20"
            onClick={() => {
              localStorage.setItem('role', 'student');
              window.location.href = './platform/auth/signup';
            }}
          >
            Student Signup
          </Button>
          <Button
            variant="outline"
            className="flex lg:text-xl h-12 w-39.5 items-center justify-center rounded-full border border-solid text-slate-900 border-slate-900 px-5 transition-colors hover:bg-black/4 md:w-75 md:h-20"
            onClick={() => {
              localStorage.setItem('role', 'student');
              window.location.href = './platform/auth/login';
            }}
          >
            Student Login
          </Button>
        </div>
      </main>
    </div>
  );
}
