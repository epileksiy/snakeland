import React,{useEffect} from 'react';


// utility functions
function shallowEquals(arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
}

function arrayDiff(arr1, arr2) {
  return arr1.map((a, i) => a - arr2[i]);
}

// display a single cell
function GridCell(props) {
  const classes = `grid-cell ${props.foodCell ? "grid-cell--food" : ""} ${props.snakeCell ? "grid-cell--snake" : ""}`;
  return (
    <div className={classes} style={{ height: `${props.size}px`, width: `${props.size}px` }} />
  );
}

// SnakeGame Component
class SnakeGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snake: [[5, 5]], // начальная позиция змейки
      food: [],
      status: 0, // 0 - не начата, 1 - в процессе, 2 - закончена
      direction: 39 // начальное направление (вправо)
    };

    this.moveFood = this.moveFood.bind(this);
    this.checkIfAteFood = this.checkIfAteFood.bind(this);
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.moveSnake = this.moveSnake.bind(this);
    this.doesntOverlap = this.doesntOverlap.bind(this);
    this.setDirection = this.setDirection.bind(this);
    this.removeTimers = this.removeTimers.bind(this);
  }

  // Метод для перемещения еды
  moveFood() {
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
    const x = Math.floor(Math.random() * this.numCells);
    const y = Math.floor(Math.random() * this.numCells);
    this.setState({ food: [x, y] });
    this.moveFoodTimeout = setTimeout(this.moveFood, 5000);
  }

  setDirection({ keyCode }) {
    let changeDirection = true;
    [[38, 40], [37, 39]].forEach(dir => {
      if (dir.includes(this.state.direction) && dir.includes(keyCode)) {
        changeDirection = false;
      }
    });

    if (changeDirection) this.setState({ direction: keyCode });
  }

  moveSnake() {
    const newSnake = [];
    // устанавливаем новую "голову" змеи
    switch (this.state.direction) {
      case 40: // вниз
        newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
        break;
      case 38: // вверх
        newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
        break;
      case 39: // вправо
        newSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
        break;
      case 37: // влево
        newSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
        break;
    }
    // сдвигаем каждый "сегмент тела" в позицию предыдущего сегмента
    newSnake.push(...this.state.snake.slice(0, -1));

    this.setState({ snake: newSnake });

    this.checkIfAteFood(newSnake);
    if (!this.isValid(newSnake[0]) || !this.doesntOverlap(newSnake)) {
      this.endGame(); // заканчиваем игру
    }
  }

  checkIfAteFood(newSnake) {
    if (!shallowEquals(newSnake[0], this.state.food)) return; // если еда не съедена
    // увеличиваем длину змейки
    let newSnakeSegment = [...newSnake[newSnake.length - 1]];
    this.setState(prevState => ({
      snake: [...prevState.snake, newSnakeSegment],
      food: []
    }));
    this.moveFood(); // перемещаем еду
    console.log('My score:',this.state.snake.length)
    this.props.onScoreChange(this.state.snake.length)
  }

  isValid(cell) {
    return (
      cell[0] >= 0 &&
      cell[1] >= 0 &&
      cell[0] < this.numCells &&
      cell[1] < this.numCells
    );
  }

  doesntOverlap(snake) {
    return snake.slice(1).every(c => !shallowEquals(snake[0], c));
  }

  startGame() {
    this.removeTimers();
    this.moveSnakeInterval = setInterval(this.moveSnake, 130);
    this.moveFood();
    this.setState({
      status: 1,
      snake: [[5, 5]], // начальная позиция змеи
      food: [10, 10] // начальная позиция еды
    });
    this.el.focus(); // фокусируемся для обработки событий клавиатуры
    this.props.onScoreChange(0);
  }

  checkoutGame(){

    let data = {
        score: this.props
    }

    // tg.sendData(JSON.stringify(data));
  }

  endGame() {
    this.removeTimers();
    this.setState({ status: 2 });
  }

  removeTimers() {
    if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
    if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout);
  }

  componentWillUnmount() {
    this.removeTimers();
  
  }

  render() {
    this.numCells = Math.floor(this.props.size / 20); // вычисляем количество ячеек
    const cellSize = this.props.size / this.numCells;
    const cells = Array.from({ length: this.numCells }, (_, y) =>
      Array.from({ length: this.numCells }, (_, x) => {
        const foodCell = shallowEquals(this.state.food, [x, y]);
        const snakeCell = this.state.snake.some(c => shallowEquals(c, [x, y]));
        return (
          <GridCell
            foodCell={foodCell}
            snakeCell={snakeCell}
            size={cellSize}
            key={`${x}-${y}`}
          />
        );
      })
    );

    // Обработка состояния игры
    let overlay;
    if (this.state.status === 0) {
      overlay = (
        <div className="snake-app__overlay">
          <button onClick={this.startGame} className='font-mine buttonsnake'>НАЧАТЬ ИГРУ!</button>
        </div>
      );
    } else if (this.state.status === 2) {
      overlay = (
        <div className="snake-app__overlay">
          <div className="mb-1 font-mine"><b>КОНЕЦ ИГРЫ!</b></div>
          <div className="mb-1 font-mine">Твой счёт: {this.state.snake.length}</div>
          <button onClick={this.startGame} className='font-mine buttonsnake'>ПОПРОБОВАТЬ ЕЩЁ</button>
          <button onClick={this.props.onFinish()} className='font-mine buttonsnake mt-5'>ПОЛУЧИТЬ ОЧКИ</button>
        </div>
      );
    }

    return (
      <div
        className="snake-app"
        onKeyDown={this.setDirection}
        ref={el => (this.el = el)}
        tabIndex={-1}
        style={{
          width: this.props.size + "px",
          height: this.props.size + "px",
          position: 'relative'
        }}
      >
        {overlay}
        <div
          className="grid"
          style={{
            width: this.props.size + "px",
            height: this.props.size + "px",
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          {cells}
        </div>
      </div>
    );
  }
}

export default SnakeGame;
