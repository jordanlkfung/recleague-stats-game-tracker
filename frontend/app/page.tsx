"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const navigateToLeagues = () => {
    router.push("/leagues");
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">StatTracker</h1>
        <p className="text-lg text-gray-300 mb-8">
          Your one-stop solution for tracking league stats, teams, and more.
        </p>
      </div>

      <div className="flex gap-6">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition">
          Log In
        </button>
        <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition"
          onClick={() => router.push("/signup")}>
          Sign Up
        </button>
        <button
          onClick={navigateToLeagues}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition"
        >
          Leagues
        </button>
      </div>
    </div>
  );
}