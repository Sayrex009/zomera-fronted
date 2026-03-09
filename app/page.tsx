import Image from "next/image";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
export default function Home() {
  return (
    <div>
      <Navbar />
        <Register />
    </div>
  );
}
