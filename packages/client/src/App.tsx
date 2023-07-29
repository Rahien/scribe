import "./App.css";
import { UploadMp3 } from "./UploadMp3";
import { tokens } from "./tokens";

function App() {
  return (
    <div
      css={{
        margin: "0 auto",
        padding: tokens.spacing.large,
      }}
    >
      <h1>Scribe</h1>
      <UploadMp3 />
    </div>
  );
}

export default App;
