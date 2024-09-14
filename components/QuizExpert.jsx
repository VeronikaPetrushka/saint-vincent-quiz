import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lettersGrid1, lettersGrid2, lettersGrid3, lettersGrid4, lettersGrid5 } from '../constants/letterGrid.js';
import { words1, words2, words3, words4, words5 } from '../constants/words.js';
import Icons from './Icons.jsx';

const { width } = Dimensions.get('window');
const gridSize = 12;
const cellSize = (width - 80) / gridSize;
const rowMargin = 2;

const QuizExpert = () => {
    const navigation = useNavigation();
    const [currentGridIndex, setCurrentGridIndex] = useState(0);
    const [highlightedLetters, setHighlightedLetters] = useState([]);
    const [foundWords, setFoundWords] = useState(new Set());
    const [timer, setTimer] = useState(60);
    const [isFinished, setIsFinished] = useState(false);
    const [totalBalance, setTotalBalance] = useState(0);

    const letterGrids = [lettersGrid1, lettersGrid2, lettersGrid3, lettersGrid4, lettersGrid5];
    const wordLists = [words1, words2, words3, words4, words5];
    const currentGrid = letterGrids[currentGridIndex];
    const currentWords = wordLists[currentGridIndex];

    const balance = 'balance';

    useEffect(() => {
        const loadTotalBalance = async () => {
            try {
                const storedTotalBalance = await AsyncStorage.getItem('totalBalance');
                if (storedTotalBalance !== null) {
                    setTotalBalance(parseInt(storedTotalBalance, 10));
                }
            } catch (error) {
                console.error('Failed to load total balance:', error);
            }
        };

        loadTotalBalance();
    }, []);

    useEffect(() => {
        if (timer <= 0 || foundWords.size === currentWords.length) {
            finishGame();
            return;
        }
        
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, foundWords, currentWords]);

    const updateTotalBalance = async (newBalance) => {
        try {
            await AsyncStorage.setItem('totalBalance', newBalance.toString());
            setTotalBalance(newBalance);
        } catch (error) {
            console.error('Failed to save total balance:', error);
        }
    };

    const finishGame = async () => {
        if (foundWords.size === currentWords.length) {
            const finalScore = 500;
            const newBalance = totalBalance + finalScore;
            await updateTotalBalance(newBalance);
            Alert.alert('Congratulations!', `You've found all words. Your new balance is ${newBalance}`);
        } else {
            // Alert.alert('Game Over', 'You didn\'t find all the words. Try again!');
        }
        setIsFinished(true);
    };

    const resetGame = () => {
        setHighlightedLetters([]);
        setFoundWords(new Set());
        setTimer(60);
        setIsFinished(false);
    };

    const trackHighlightedLetters = (letter, rowIndex, colIndex) => {
        if (isFinished) return;

        const key = `${rowIndex}-${colIndex}`;
        const isCorrect = checkIfCorrectLetter(letter, rowIndex, colIndex);

        setHighlightedLetters(prev => {
            const newHighlightedLetters = [...prev];
            const index = newHighlightedLetters.findIndex(item => item.key === key);
            
            if (index > -1) {
                newHighlightedLetters.splice(index, 1);
            } else {
                newHighlightedLetters.push({ key, letter, isCorrect });
            }
            
            if (isCorrect) {
                checkForWords(newHighlightedLetters);
            }

            return newHighlightedLetters;
        });
    };

    const checkIfCorrectLetter = (letter, rowIndex, colIndex) => {
        const row = currentGrid[rowIndex];
        const column = currentGrid.map(row => row[colIndex]);

        return currentWords.some(word => {
            return checkConsecutiveLetters(row, word) || checkConsecutiveLetters(column, word);
        });
    };

    const checkConsecutiveLetters = (line, word) => {
        const lineStr = line.join('');
        for (let i = 0; i <= lineStr.length - word.length; i++) {
            if (lineStr.substring(i, i + word.length) === word) {
                return true;
            }
        }
        return false;
    };

    const checkForWords = (highlightedLetters) => {
        const highlightedLetterPositions = new Set(highlightedLetters.map(item => item.key));

        const newlyFoundWords = new Set();
        currentWords.forEach(word => {
            const positions = getWordLetterPositions(word);
            const isFullyHighlighted = positions.every(pos => highlightedLetterPositions.has(pos));
            if (isFullyHighlighted && !foundWords.has(word)) {
                newlyFoundWords.add(word);
            }
        });

        if (newlyFoundWords.size > 0) {
            setFoundWords(prev => new Set([...prev, ...newlyFoundWords]));
        }
    };

    const getWordLetterPositions = (word) => {
        const positions = [];
        for (let r = 0; r < currentGrid.length; r++) {
            const rowStr = currentGrid[r].join('');
            const colStr = currentGrid.map(row => row[r]).join('');

            findWordInLine(rowStr, word, r, positions, true);
            findWordInLine(colStr, word, r, positions, false);
        }
        return positions;
    };

    const findWordInLine = (lineStr, word, rowIndex, positions, isRow) => {
        for (let i = 0; i <= lineStr.length - word.length; i++) {
            if (lineStr.substring(i, i + word.length) === word) {
                for (let j = 0; j < word.length; j++) {
                    const key = isRow ? `${rowIndex}-${i + j}` : `${i + j}-${rowIndex}`;
                    positions.push(key);
                }
            }
        }
    };

    const getCellStyle = (rowIndex, colIndex) => {
        const key = `${rowIndex}-${colIndex}`;
        const highlighted = highlightedLetters.find(item => item.key === key);

        if (highlighted) {
            return highlighted.isCorrect ? styles.correctCell : styles.incorrectCell;
        }

        return styles.cell;
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleNextGrid = () => {
        setCurrentGridIndex((prevIndex) => (prevIndex + 1) % letterGrids.length);
        resetGame();
    };

    const totalWords = currentWords.length;
    const foundCount = foundWords.size;
    const allWordsFound = foundCount === totalWords;

    return (
        <View style={styles.container}>
            {isFinished ? (
                <View style={styles.finishContainer}>
                    <Text style={styles.finishText}>
                        {allWordsFound ? "Congratulations! You've found all words." : "Time's up! Quiz is finished."}
                    </Text>
                    {!allWordsFound && (
                        <TouchableOpacity style={styles.button} onPress={resetGame}>
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    )}
                    {allWordsFound && (
                        <TouchableOpacity style={styles.button} onPress={handleNextGrid}>
                            <Text style={styles.buttonText}>Next Grid</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                        <Text style={styles.buttonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    {currentGrid.map((row, rowIndex) => (
                        <View key={rowIndex} style={[styles.row, { marginBottom: rowIndex < currentGrid.length - 1 ? rowMargin : 0 }]}>
                            {row.map((letter, colIndex) => (
                                <TouchableOpacity
                                    key={colIndex}
                                    style={[getCellStyle(rowIndex, colIndex)]}
                                    onPress={() => trackHighlightedLetters(letter, rowIndex, colIndex)}
                                >
                                    <Text style={styles.letter}>{letter}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                    <View style={styles.statsContainer}>
                        <View style={styles.statsInnerContainer}>
                        <Text style={styles.statsText}>{foundCount} / {totalWords}</Text>
                        <Text style={styles.timerText}>{timer}s</Text>
                        <View style={styles.balanceContainer}>
                        <Icons type={balance}/>
                        <Text style={styles.balanceText}>{totalBalance}</Text>
                        </View>
                        </View>
                        <Text style={styles.foundText}>Found Words:</Text>
                        {Array.from(foundWords).map((word, index) => (
                            <Text key={index} style={styles.foundWord}>{word}</Text>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        justifyContent: 'start',
        alignItems: 'center',
        padding: 10,
        paddingVertical: 70,
        marginTop: 20,
        height: "105%",
        width: "100%",
        backgroundColor: '#c7d3b8'
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: cellSize,
        height: cellSize,
        borderRadius: cellSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'grey',
        margin: 2,
    },
    correctCell: {
        width: cellSize,
        height: cellSize,
        borderRadius: cellSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'green',
        borderColor: 'green',
        margin: 2,
    },
    incorrectCell: {
        width: cellSize,
        height: cellSize,
        borderRadius: cellSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'red',
        borderColor: 'red',
        margin: 2,
    },
    letter: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    statsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    statsText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    foundText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    foundWord: {
        fontSize: 18,
        color: 'green',
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    },
    finishContainer: {
        alignItems: 'center',
        padding: 20,
        width: '100%'
    },
    finishText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 200,
        marginTop: 50,
        width: '100%',
        marginLeft: 50
    },
    button: {
        backgroundColor: '#618e4d',
        padding: 15,
        borderRadius: 10,
        margin: 5,
        width: 350,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    balanceText: {
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    statsInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 370,
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 30
    }
});

export default QuizExpert;




//   

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { lettersGrid1 } from '../constants/letterGrid.js';
// import { words1 } from '../constants/words.js';

// const { width } = Dimensions.get('window');
// const gridSize = 12;
// const cellSize = (width - 80) / gridSize;
// const rowMargin = 2;

// const QuizExpert = () => {
//   const navigation = useNavigation();
//   const [highlightedLetters, setHighlightedLetters] = useState([]);
//   const [foundWords, setFoundWords] = useState(new Set());
//   const [timer, setTimer] = useState(60);
//   const [isFinished, setIsFinished] = useState(false);

//   useEffect(() => {
//     if (timer <= 0) {
//       setIsFinished(true);
//       return;
//     }

//     const interval = setInterval(() => {
//       setTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timer]);

//   const resetGame = () => {
//     setHighlightedLetters([]);
//     setFoundWords(new Set());
//     setTimer(60);
//     setIsFinished(false);
//   };

//   const trackHighlightedLetters = (letter, rowIndex, colIndex) => {
//     if (isFinished) return;

//     const key = `${rowIndex}-${colIndex}`;
//     console.log(`Tracking letter: ${letter} at (${rowIndex}, ${colIndex})`);

//     if (highlightedLetters.some(item => item.key === key)) {
//       console.log(`Unhighlighting letter: ${letter} at (${rowIndex}, ${colIndex})`);
//       setHighlightedLetters(highlightedLetters.filter(item => item.key !== key));
//     } else {
//       const isCorrect = checkIfCorrectLetter(letter, rowIndex, colIndex);
//       console.log(`Is letter correct? ${isCorrect}`);
//       const newHighlightedLetters = [...highlightedLetters, { key, letter, isCorrect }];
//       setHighlightedLetters(newHighlightedLetters);
      
//       checkForWords(newHighlightedLetters);
//     }
//   };

//   const checkIfCorrectLetter = (letter, rowIndex, colIndex) => {
//     const positions = getWordLetterPositions();
//     const key = `${rowIndex}-${colIndex}`;
//     return positions.some(pos => pos.key === key);
//   };

//   const checkForWords = (highlightedLetters) => {
//     const highlightedLetterPositions = new Set(highlightedLetters.map(item => item.key));
//     console.log('Highlighted letter positions:', highlightedLetterPositions);

//     const newlyFoundWords = new Set();
//     words1.forEach(word => {
//       const positions = getWordLetterPositions(word);
//       const isFullyHighlighted = positions.every(pos => highlightedLetterPositions.has(pos.key) && highlightedLetters.find(item => item.key === pos.key)?.isCorrect);
      
//       if (isFullyHighlighted && !foundWords.has(word)) {
//         console.log(`Word found: ${word}`);
//         newlyFoundWords.add(word);
//       }
//     });

//     if (newlyFoundWords.size > 0) {
//       setFoundWords(prevFoundWords => {
//         const updatedFoundWords = new Set(prevFoundWords);
//         newlyFoundWords.forEach(word => updatedFoundWords.add(word));
//         console.log('Updated foundWords:', updatedFoundWords);
//         return updatedFoundWords;
//       });
//     }
//   };

//   const getWordLetterPositions = (word) => {
//     const positions = [];
//     if (!lettersGrid1 || !Array.isArray(lettersGrid1)) {
//       console.error('lettersGrid1 is not defined or not an array');
//       return positions;
//     }

//     for (let r = 0; r < lettersGrid1.length; r++) {
//       const rowStr = lettersGrid1[r].join('');
//       const colStr = lettersGrid1.map(row => row[r]).join('');

//       words1.forEach(word => {
//         findWordInLine(rowStr, word, r, positions, true);
//         findWordInLine(colStr, word, r, positions, false);
//       });
//     }
//     console.log('Word letter positions:', positions);
//     return positions;
//   };

//   const findWordInLine = (lineStr, word, index, positions, isRow) => {
//     for (let i = 0; i <= lineStr.length - word.length; i++) {
//       if (lineStr.substring(i, i + word.length) === word) {
//         for (let j = 0; j < word.length; j++) {
//           const key = isRow ? `${index}-${i + j}` : `${i + j}-${index}`;
//           positions.push({ key, letter: word[j] });
//         }
//       }
//     }
//   };

//   const getCellStyle = (letter, rowIndex, colIndex) => {
//     const key = `${rowIndex}-${colIndex}`;
//     const highlighted = highlightedLetters.find(item => item.key === key);

//     if (highlighted) {
//       return highlighted.isCorrect ? styles.correctCell : styles.incorrectCell;
//     }

//     return styles.cell;
//   };

//   const handleGoBack = () => {
//     navigation.goBack();
//   };

//   const totalWords = words1.length;
//   const foundCount = foundWords.size;
//   const allWordsFound = foundCount === totalWords;

//   console.log('Total Words:', totalWords);
//   console.log('Found Count:', foundCount);
//   console.log('Found Words:', Array.from(foundWords));

//   return (
//     <View style={styles.container}>
//       {isFinished ? (
//         <View style={styles.finishContainer}>
//           <Text style={styles.finishText}>
//             {allWordsFound ? "Congratulations! You've found all words." : "Time's up! Quiz is finished."}
//           </Text>
//           {!allWordsFound && (
//             <TouchableOpacity style={styles.button} onPress={resetGame}>
//               <Text style={styles.buttonText}>Try Again</Text>
//             </TouchableOpacity>
//           )}
//           <TouchableOpacity style={styles.button} onPress={handleGoBack}>
//             <Text style={styles.buttonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <>
//           {lettersGrid1.map((row, rowIndex) => (
//             <View
//               key={rowIndex}
//               style={[styles.row, { marginBottom: rowIndex < lettersGrid1.length - 1 ? rowMargin : 0 }]}
//             >
//               {row.map((letter, colIndex) => (
//                 <TouchableOpacity
//                   key={colIndex}
//                   style={[getCellStyle(letter, rowIndex, colIndex)]}
//                   onPress={() => trackHighlightedLetters(letter, rowIndex, colIndex)}
//                 >
//                   <Text style={styles.letter}>{letter}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           ))}
//           <View style={styles.statsContainer}>
//             <Text style={styles.statsText}>{foundCount} / {totalWords}</Text>
//             <Text style={styles.statsText}>Found Words:</Text>
//             {Array.from(foundWords).map((word, index) => (
//               <Text key={index} style={styles.foundWord}>{word}</Text>
//             ))}
//             <Text style={styles.timerText}>Time Remaining: {timer}s</Text>
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'start',
//     alignItems: 'center',
//     padding: 10,
//     marginTop: 20,
//     height: "100%",
//     width: "100%",
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   cell: {
//     width: cellSize,
//     height: cellSize,
//     borderRadius: cellSize / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     backgroundColor: 'grey',
//     margin: 2,
//   },
//   correctCell: {
//     width: cellSize,
//     height: cellSize,
//     borderRadius: cellSize / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     backgroundColor: 'green',
//     borderColor: 'green',
//     margin: 2,
//   },
//   incorrectCell: {
//     width: cellSize,
//     height: cellSize,
//     borderRadius: cellSize / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     backgroundColor: 'red',
//     borderColor: 'red',
//     margin: 2,
//   },
//   letter: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   statsContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   statsText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   foundWord: {
//     fontSize: 16,
//     color: 'green',
//   },
//   timerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   finishContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//   },
//   finishText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'red',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//     margin: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default QuizExpert;

