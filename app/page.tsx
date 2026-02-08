import Image from "next/image";

export default function Home() {
  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full min-h-screen flex-col items-start justify-between py-32 px-16 lg:items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-start sm:items-start sm:text-left">
          <h1 className="max-w-xs lg:text-[100px] text-5xl font-semibold leading-10 tracking-tight text-slate-950 dark:text-zinc-50">
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
        <div className="flex flex-col justify-between w-[50%] gap-4 text-base font-medium lg:flex-row">
          <a
            className="w-39.5 flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-slate-100 transition-colors hover:bg-slate-800 hover:text-slate-100 hover:border-slate-800 border md:w-75 md:h-20"
            href="./platform/auth/login"
            target="_self"
            rel="noopener noreferrer"
          >
            Admin Login
          </a>
          <a
            className="flex h-12 w-39.5 items-center justify-center rounded-full border border-solid text-slate-950 border-slate-950 px-5 transition-colors hover:bg-black/4 md:w-75 md:h-20"
            href="./platform/auth/signup"
            target="_self"
            rel="noopener noreferrer"
          >
            Student Signup
          </a>
          <a
            className="flex h-12 w-39.5 items-center justify-center rounded-full border border-solid text-slate-950 border-slate-950 px-5 transition-colors hover:bg-black/4 md:w-75 md:h-20"
            href="./platform/auth/login"
            target="_self"
            rel="noopener noreferrer"
          >
            Student Login
          </a>
        </div>
      </main>
    </div>
  );
}
