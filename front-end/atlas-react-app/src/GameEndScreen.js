import PersonalScoreBoard from "./PersonalScoreboard";
import Registration from "./Registration";

export default async function GameEndScreen({ score, isLoggedIn }) {
    return (
        <div>
            {isLoggedIn ? <PersonalScoreBoard /> : (
                <div>
                    <h2>Register to save your score</h2>
                    <Registration
                    saveScore={true}
                    />
                </div>
            )}
            <div>
                <h2>Your final score</h2>
                <p>{score}</p>
            </div>

        </div>
    )
}
