interface team {
    name: String
}
interface data {
    teams: [team]
}
export default function season(props: data) {
    return (
        <>
            <div>
                upcoming games
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white">
                <table>
                    <tr></tr>
                    <tr>Team</tr>
                    {/* <tr>Win</tr>
                    <tr>Loss</tr>
                    <tr>Pct</tr> */}
                </table>
                {props.teams.map((item, index) => {
                    return (
                        <tr>
                            <td>{index}</td>
                            <td>{item.name}</td>
                        </tr>
                    )
                })}
            </div>
        </>
    );
}

export async function getServerSideProps() {
    //GET getting all games 
    const queryParams = new URLSearchParams({
        _id: "leagueID",
        _sid: "seasonID"
    })
    const request = await fetch(`/api/league/season/${queryParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },

    });
    const data = request.json();

    return ({ props: data })
}

