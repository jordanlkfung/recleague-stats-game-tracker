// import { useRouter } from "next/navigation";

export default function Leagues() {
  // const router = useRouter();

  // const navigateToLeagues = () => {
  //     router.push("/leagues");
  // };


  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">Leagues</h1>
      </div>
      <table className='table table-fixed w-11/12 mt-3 border-seperate border border-spacing-2'>
        <thead>
          <tr className='flex space-x-4 border border-spacing-2'>
            <th className='w-1/5 text-center self-center'>League Name</th>
            <th className='w-1/5 text-center self-center'>Sport</th>
            <th className='w-1/6 text-center self-center'>Season Start Date</th>
            <th className='w-1/5 text-center self-center'>Manager</th>
            <th className='w-1/12 text-center self-center'>Number of Teams</th>
            <th className='w-1/5 text-center self-center'>Join</th>
          </tr>
        </thead>
        <tbody>
          <tr className='flex space-x-4 border border-spcaing-2'>
            <td className='w-1/5 text-center'>asd</td>
            <td className='w-1/5 text-center'>asd</td>
            <td className='w-1/6 text-center'>as</td>
            <td className='w-1/5 text-center'>ds</td>
            <td className='w-1/12 text-center'>4</td>
            <th className='w-1/5 text-center'>Join</th>
          </tr>
        </tbody>
      </table>
      <div className="absolute bottom-4 right-4">
        <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg shadow-md transition">
          Create New League
        </button>
      </div>
    </div>
  );
}