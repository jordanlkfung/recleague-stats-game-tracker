
export default function Season() {

    const fetchStandings = async () => {
        try {
            //get teams and win loss
            const response = await fetch('', { method: 'GET' });
            if (!response.ok)
                //error
                return response.body;
        }
        catch (e) {

        }
    }

    const teams = [{
        name: "test",
        win: "1",
        loss: "0"
    }];
    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white pt-3">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">Standings</h1>
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
                <table className='table table-fixed w-3/4 mt-3 border-seperate border border-spacing-2'>
                    <thead>
                        <tr className='flex space-x-4 border border-spacing-2'>
                            <th className='w-1/12 text-center self-center'>#</th>
                            <th className='w-1/5 text-center self-center'>Team Name</th>
                            <th className='w-1/12 text-center self-center'>Win</th>
                            <th className='w-1/12 text-center self-center'>Loss</th>
                            <th className="w-1/5"></th>
                        </tr>
                    </thead>
                    {teams.map((team, index) => {
                        return (
                            <tr className='flex space-x-4 border border-spcaing-2'>
                                <td>{index + 1}</td>
                                <td>{team.name}</td>
                                <td>{team.win}</td>
                                <td>{team.loss}</td>
                                <th className='w-1/5 text-center'><button className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded-lg my-1">View</button></th>

                            </tr>
                        )
                    })}
                </table>
            </div>
        </div>
    )
}