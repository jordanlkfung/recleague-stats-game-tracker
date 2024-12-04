'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AddSeason() {
  const router = useRouter();
  const { leagueId } = useParams();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Ensure date is in 'yyyy-mm-dd' format (though the input already returns it that way)
  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    // Example POST request to add a season
    const response = await fetch(`/api/leagues/${leagueId}/season`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      }),
    });

    if (response.ok) {
        console.log("Season added successfully");
        router.push(`/leagues/${leagueId}`);
    } else {
      console.error("Error adding season");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Add Season</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-96 bg-gray-800 p-6 rounded-lg">
        <div>
          <label className="text-lg">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
          />
        </div>

        <div>
          <label className="text-lg">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition"
        >
          Add Season
        </button>
      </form>
    </div>
  );
}
