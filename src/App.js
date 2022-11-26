import React, { useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";

const alanKey =
  "7ab64f3faef4d1d185a1b4dd66d16e612e956eca572e1d8b807a3e2338fdd0dc/stage";

const App = () => {
  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles }) => {
        if(command === 'newHeadlines'){
          console.log(articles);
        }
      },
    });
  }, []);
  return (
    <div>
      <h1>Alan AI News Application</h1>
    </div>
  );
};

export default App;
