'use client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function LeagueID() {
    const router = useRouter();
    const { leagueId } = useParams();
    const [league, setLeague] = useState([]);

    useEffect(() => {
        const fetchLeague = async () => {
            try {
                const response = await fetch(`/api/leagues/${leagueId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLeague(data);
                    console.log(league);
                } else {
                    console.error('Error getting league by ID');
                }
            } catch (error) {
                console.error("An error occurred while fetching getting league:", error);
            }
        }

        fetchLeague();
    }, [league, leagueId]);

    return <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">{leagueId}</h1>
            </div>
            <table className='table table-fixed w-11/12 mt-3 border-seperate border border-spacing-2'>
                <thead>
                    <tr className='flex space-x-4 border border-spacing-2'>
                        <th className='w-1/12'></th>
                        <th className='w-1/5 text-center self-center'>Season #</th>
                        <th className='w-1/5 text-center self-center'>Start Date</th>
                        <th className='w-1/6 text-center self-center'>End Date</th>
                        <th className='w-1/12 text-center self-center'>Number of Teams</th>
                        <th className='w-1/5 text-center self-center'>Manager</th>
                        <th className='w-1/5 text-center self-center'></th>
                    </tr>
                </thead>
                <tbody>
                    {/** data will be filled in with api call */}
                    <tr className='flex space-x-4 border border-spcaing-2'>
                        {/* checkbox for delete */}
                        <td className="w-1/12 flex items-center justify-center"><input type="checkbox" className='' /></td>
                        <td className='w-1/5 text-center self-center'>asd</td>
                        <td className='w-1/5 text-center self-center'>asd</td>
                        <td className='w-1/6 text-center self-center'>as</td>
                        <td className='w-1/12 text-center self-center'>4</td>

                        <td className='w-1/5 text-center self-center'>4</td>
                        <th className='w-1/5 text-center'><button className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg my-1">View</button></th>
                    </tr>

                </tbody>
            </table>
            <div className="absolute bottom-4 right-4">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition">
                    Create New League
                </button>
            </div>
        </div>
    </div>
}