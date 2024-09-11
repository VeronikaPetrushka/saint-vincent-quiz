import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { lettersGrid1 } from '../constants/letterGrid.js';
import { words1 } from '../constants/words.js';

const { width } = Dimensions.get('window');
const gridSize = 12;
const cellSize = (width - 80) / gridSize;
const rowMargin = 2;

const QuizExpert = () => {
    const navigation = useNavigation();
    const [highlightedLetters, setHighlightedLetters] = useState([]);
    const [foundWords, setFoundWords] = useState(new Set());
    const [timer, setTimer] = useState(60);
    const [isFinished, setIsFinished] = useState(false);
  
    useEffect(() => {
      if (timer <= 0) {
        setIsFinished(true);
        return;
      }
      
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
  
      return () => clearInterval(interval);
    }, [timer]);
  
    const resetGame = () => {
      setHighlightedLetters([]);
      setFoundWords(new Set());
      setTimer(60);
      setIsFinished(false);
    };
  
    const trackHighlightedLetters = (letter, rowIndex, colIndex) => {
      if (isFinished) return;
      
      const newHighlightedLetters = [...highlightedLetters];
      const key = `${rowIndex}-${colIndex}`;
      
      if (newHighlightedLetters.some(item => item.key === key)) {
        setHighlightedLetters(newHighlightedLetters.filter(item => item.key !== key));
      } else {
        const isCorrect = checkIfCorrectLetter(letter, rowIndex, colIndex);
        newHighlightedLetters.push({ key, letter, isCorrect });
        setHighlightedLetters(newHighlightedLetters);
        if (isCorrect) {
          checkForWords(newHighlightedLetters);
        }
      }
    };
  
    const checkIfCorrectLetter = (letter, rowIndex, colIndex) => {
      const row = lettersGrid1[rowIndex];
      const column = lettersGrid1.map(row => row[colIndex]);
      
      return words1.some(word => {
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
      words1.forEach(word => {
        const positions = getWordLetterPositions(word);
        const isFullyHighlighted = positions.every(pos => highlightedLetterPositions.has(pos));
        if (isFullyHighlighted && !foundWords.has(word)) {
          newlyFoundWords.add(word);
        }
      });
  
      if (newlyFoundWords.size > 0) {
        setFoundWords(new Set([...foundWords, ...newlyFoundWords]));
      }
    };
  
    const getWordLetterPositions = (word) => {
      const positions = [];
      for (let r = 0; r < lettersGrid1.length; r++) {
        const rowStr = lettersGrid1[r].join('');
        const colStr = lettersGrid1.map(row => row[r]).join('');

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
  
    const getCellStyle = (letter, rowIndex, colIndex) => {
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
  
    const totalWords = words1.length;
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
            <TouchableOpacity style={styles.button} onPress={handleGoBack}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {lettersGrid1.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { marginBottom: rowIndex < lettersGrid1.length - 1 ? rowMargin : 0 }]}>
                {row.map((letter, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    style={[getCellStyle(letter, rowIndex, colIndex)]}
                    onPress={() => trackHighlightedLetters(letter, rowIndex, colIndex)}
                  >
                    <Text style={styles.letter}>{letter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>Total Words: {totalWords}</Text>
              <Text style={styles.statsText}>Words Found: {foundCount}</Text>
              <Text style={styles.statsText}>Found Words:</Text>
              {Array.from(foundWords).map((word, index) => (
                <Text key={index} style={styles.foundWord}>{word}</Text>
              ))}
              <Text style={styles.timerText}>Time Remaining: {timer}s</Text>
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
      marginTop: 20,
      height: "100%",
      width: "100%"
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
      fontSize: 16,
      fontWeight: 'bold',
    },
    foundWord: {
      fontSize: 16,
      color: 'green',
    },
    timerText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
    finishContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    finishText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'red',
      marginBottom: 20,
    },
    button: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      margin: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  export default QuizExpert;
