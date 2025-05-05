import { useReducer } from "react";
import InputProcessor, { State } from "./classes/InputProcessor.ts";
import Display from "./components/Display.tsx";
import Button from "./components/Button.tsx";
import useKeyboard from "./hooks/useKeyboard.ts";
import buttons from "./buttons.json";
import "./App.css";

type ButtonAction = {
  type: string,
  id: string,
  key: string
};

const processor = new InputProcessor(12);
const initialState: State = {
  expression: "",
  notation: "0",
  history: [],
  isDirty: false
};

function buttonReducer(state: State, action: ButtonAction): State {
  switch (action.type) {
    case "RESET":
      return initialState;
    case "RESULT":
      return { ...state, ...processor.getResult(state, action.key) };
    case "NUMBER":
      return { ...state, ...processor.insertNumber(state, action.key) };
    case "OPERATOR":
      return { ...state, ...processor.insertOperand(state, action.key) };
    case "MODIFIER":
      return { ...state, ...processor.insertModifier(state, action.id, action.key) };
    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [app, dispatch] = useReducer(buttonReducer, initialState);

  // Activate the function when user press specific key or click button
  const activateButton = (buttonPressed: string) => {
    if (buttons.map(b => b.btnKey).includes(buttonPressed)) {
      // Get the user target button properties
      const [button] = buttons.filter(b => b.btnKey === buttonPressed);
      // Process and dispatch based on button role
      dispatch({ type: button.btnRole, id: button.id, key: button.btnKey });
    }
  };

  // Key press detection
  useKeyboard((e) => activateButton(e.key));

  return (
    <div id="calc-container">
      <h2>Calculator</h2>
      <Display preview={app.expression} display={app.notation} />
      <div className="btn-container">
        {buttons.map((button, i) => (
          <Button key={i} button={button} fnClick={() => activateButton(button.btnKey)} />
        ))}
      </div>
    </div>
  );
}

export default App;
