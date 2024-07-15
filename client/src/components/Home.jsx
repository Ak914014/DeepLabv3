import React, { useState } from "react";
import Form from "./Form";
import Header from "./Header";

const Home = () => {
  const [image, setImage] = useState(null);

  return (
    <div className="p-5 w-full h-screen">
      <Header />
      <div className="flex gap-4 flex-row">
          <Form setImage={setImage} />

      </div>
    </div>
  );
};

export default Home;
