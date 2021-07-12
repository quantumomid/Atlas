import './ScoreBoard.css'

function Table (props) {
    const { gameData } = props
    return (
        <table>
            <TableHeader />
            <TableBody gameData={gameData} />
        </table>
    )
    
}

//functional component for table headings
function TableHeader() {
    return (
      <thead>
        <tr>
          <th>Ranking</th>
          <th>Username</th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
    )
}

//functional component for displaying the table data rows
function TableBody(props) {
    const rows = props.gameData.map((row, index) => {
        return (
            <tr key={index}>
                <td>{ row.ranking }</td>
                <td>{ row.username }</td>
                <td>{ row.score }</td>
                <td>{ (new Date(row.created_at)).toLocaleDateString() }</td>
            </tr>
        )
    })
    return (
        <tbody>{ rows }</tbody>
    )
}

export default Table