// Quiz component / maybe conditional rendering depending on mode / prop for difficulty
// Menu panel component fixed

import { SafeAreaView } from "react-native"
import Quiz from "../components/Quiz";

const QuizScreen = ({ route }) => {
    const { topic } = route.params;

    return (
        <SafeAreaView>
            <Quiz topic={topic} />
        </SafeAreaView>
    );
};

export default QuizScreen;