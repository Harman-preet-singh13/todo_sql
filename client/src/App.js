
import './App.css';
import FindTodo from './components/FindTodo';
import Todo from './components/Todo';

function App() {
  return (
    <div className="flex  max-w-5xl mx-auto  ">
     {/* <div>
      <FindTodo />
     </div> */}
      <div className="grow">
        <Todo />
      </div>
      
    </div>
  );
}

export default App;
