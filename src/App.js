import * as React from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Box, Button, Center, ChakraProvider, Flex, Text, VStack } from '@chakra-ui/react';

// Reducer slice
const ticTacToe = createSlice({
  name: 'ticTacToe',
  initialState: {
    squares: Array(9).fill(null),
    currentStep: 0,
    winner: null,
    nextValue: 'X',
    status: 'Next player: X',
  },
  reducers: {
    selectSquare(state, action) {
      if (!state.winner && !state.squares[action.payload]) {
        const newSquares = [...state.squares];
        newSquares[action.payload] = calculateNextValue(state.squares);
        const winner = calculateWinner(newSquares);
        const nextValue = calculateNextValue(newSquares);
        const status = calculateStatus(winner, newSquares, nextValue);
        return {
          squares: newSquares,
          winner,
          nextValue,
          status
        };
      }
    },
    restart(state) {
      const newSquares = Array(9).fill(null);
      const winner = calculateWinner(newSquares);
      const nextValue = calculateNextValue(newSquares);
      const status = calculateStatus(winner, newSquares, nextValue);
      return {
        squares: newSquares,
        winner,
        nextValue,
        status,
      };
    },
  },
});


// Actions
export const { selectSquare, restart, jumpToMove } = ticTacToe.actions;

// Store
const store = configureStore({
  reducer: ticTacToe.reducer,
});

// Components
function Board() {
  const { status, squares } = useSelector(state => state);
  const dispatch = useDispatch();
  function selectSquareHandler(squareIndex) {
    dispatch(selectSquare(squareIndex));
  }
  function renderSquare(i) {
    return (
      <Button
        w='100px'
        h='100px'
        m='7px'
        variant="outline"
        borderWidth="2px"
        borderColor="gray.300"
        onClick={() => selectSquareHandler(i)}>
        {squares[i]}
      </Button>
    );
  }

  return (
    <VStack m={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        {status}
      </Text>
      <Flex >
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </Flex>
      <Flex >
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </Flex>
      <Flex >
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </Flex>

    </VStack>
  );
}

function Game() {
  const dispatch = useDispatch();
  function handleRestart() {
    dispatch(restart());
  }
  return (
    <Box bg="cyan.200" minH="100vh" p={10}>
      <Box maxW="md" mx="auto" bg="teal.50" p={6} borderRadius="lg">
        <Board />
        <Center>
          <Button size="md" onClick={handleRestart} mt={6} colorScheme="teal">
            restart
          </Button>
        </Center>
      </Box>
    </Box>
  );
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <Game />
      </Provider>
    </ChakraProvider>
  );
}

export default App;
